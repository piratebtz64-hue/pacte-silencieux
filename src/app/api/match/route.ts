import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const { pactId } = await request.json();

    if (!pactId) {
      return NextResponse.json({ error: 'pactId requis' }, { status: 400 });
    }

    const current = await prisma.pact.findUnique({
      where: { id: pactId },
      include: { userA: true },
    });

    if (!current) {
      return NextResponse.json({ error: 'Pacte introuvable' }, { status: 404 });
    }

    // Already matched
    if (current.status === 'ACTIVE' && current.userBId) {
      return NextResponse.json({
        matched: true,
        pactId: current.id,
        status: current.status,
      });
    }

    if (current.status !== 'WAITING' || !current.userAId) {
      return NextResponse.json({
        matched: false,
        status: current.status,
        message: 'Pacte non disponible pour matching',
      });
    }

    // Find another WAITING pact with same duration, different user
    const partner = await prisma.pact.findFirst({
      where: {
        status: 'WAITING',
        durationDays: current.durationDays,
        id: { not: current.id },
        userAId: { not: current.userAId },
        userBId: null,
      },
      orderBy: { createdAt: 'asc' },
    });

    if (!partner || !partner.userAId) {
      return NextResponse.json({
        matched: false,
        status: 'WAITING',
        message: 'En attente d’une autre personne',
      });
    }

    const now = new Date();
    const endsAt = new Date(
      now.getTime() + current.durationDays * 24 * 60 * 60 * 1000
    );

    // Activate current pact with partner as userB; end the partner waiting pact
    const [activated] = await prisma.$transaction([
      prisma.pact.update({
        where: { id: current.id },
        data: {
          userBId: partner.userAId,
          status: 'ACTIVE',
          startedAt: now,
          endsAt,
        },
      }),
      prisma.pact.update({
        where: { id: partner.id },
        data: {
          status: 'ENDED',
          // mark as absorbed into the other pact
        },
      }),
      prisma.user.update({
        where: { id: current.userAId },
        data: { activePactId: current.id, waitingSince: null },
      }),
      prisma.user.update({
        where: { id: partner.userAId },
        data: { activePactId: current.id, waitingSince: null },
      }),
    ]);

    return NextResponse.json({
      matched: true,
      pactId: activated.id,
      status: 'ACTIVE',
      startedAt: now,
      endsAt,
    });
  } catch (error) {
    console.error('Match error:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const pactId = request.nextUrl.searchParams.get('pactId');
    if (!pactId) {
      return NextResponse.json({ error: 'pactId requis' }, { status: 400 });
    }

    const pact = await prisma.pact.findUnique({ where: { id: pactId } });
    if (!pact) {
      return NextResponse.json({ error: 'Introuvable' }, { status: 404 });
    }

    return NextResponse.json({
      matched: pact.status === 'ACTIVE' && !!pact.userBId,
      status: pact.status,
      pactId: pact.id,
    });
  } catch (error) {
    console.error('Match GET error:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
