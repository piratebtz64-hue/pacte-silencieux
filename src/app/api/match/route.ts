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
    });

    if (!current) {
      return NextResponse.json({ error: 'Pacte introuvable' }, { status: 404 });
    }

    // Déjà actif
    if (current.status === 'ACTIVE' && current.userBId) {
      return NextResponse.json({
        matched: true,
        pactId: current.id,
        status: 'ACTIVE',
      });
    }

    // Ce pacte a été absorbé (ENDED) : chercher le pacte ACTIVE de cet utilisateur
    if (current.status === 'ENDED' && current.userAId) {
      const active = await prisma.pact.findFirst({
        where: {
          status: 'ACTIVE',
          OR: [{ userAId: current.userAId }, { userBId: current.userAId }],
        },
        orderBy: { startedAt: 'desc' },
      });
      if (active) {
        return NextResponse.json({
          matched: true,
          pactId: active.id,
          status: 'ACTIVE',
        });
      }
    }

    // L’utilisateur est déjà userB d’un pacte actif (l’autre côté a matché)
    if (current.userAId) {
      const asB = await prisma.pact.findFirst({
        where: {
          status: 'ACTIVE',
          userBId: current.userAId,
        },
        orderBy: { startedAt: 'desc' },
      });
      if (asB) {
        return NextResponse.json({
          matched: true,
          pactId: asB.id,
          status: 'ACTIVE',
        });
      }
    }

    if (current.status !== 'WAITING' || !current.userAId) {
      return NextResponse.json({
        matched: false,
        status: current.status,
        message: 'Pacte non disponible pour matching',
      });
    }

    // Chercher un partenaire en attente, même durée, autre utilisateur
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

    // Garder le plus ancien comme pacte actif
    const primaryId =
      current.createdAt <= partner.createdAt ? current.id : partner.id;
    const secondaryId =
      primaryId === current.id ? partner.id : current.id;
    const primaryUserA =
      primaryId === current.id ? current.userAId : partner.userAId;
    const secondaryUserA =
      primaryId === current.id ? partner.userAId : current.userAId;

    await prisma.$transaction([
      prisma.pact.update({
        where: { id: primaryId },
        data: {
          userAId: primaryUserA,
          userBId: secondaryUserA,
          status: 'ACTIVE',
          startedAt: now,
          endsAt,
        },
      }),
      prisma.pact.update({
        where: { id: secondaryId },
        data: { status: 'ENDED' },
      }),
      prisma.user.update({
        where: { id: primaryUserA! },
        data: { activePactId: primaryId, waitingSince: null },
      }),
      prisma.user.update({
        where: { id: secondaryUserA! },
        data: { activePactId: primaryId, waitingSince: null },
      }),
    ]);

    return NextResponse.json({
      matched: true,
      pactId: primaryId,
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

    // Même logique bilatérale en GET
    if (pact.status === 'ACTIVE' && pact.userBId) {
      return NextResponse.json({
        matched: true,
        status: 'ACTIVE',
        pactId: pact.id,
      });
    }

    if (pact.userAId) {
      const active = await prisma.pact.findFirst({
        where: {
          status: 'ACTIVE',
          OR: [{ userAId: pact.userAId }, { userBId: pact.userAId }],
        },
      });
      if (active) {
        return NextResponse.json({
          matched: true,
          status: 'ACTIVE',
          pactId: active.id,
        });
      }
    }

    return NextResponse.json({
      matched: false,
      status: pact.status,
      pactId: pact.id,
    });
  } catch (error) {
    console.error('Match GET error:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
