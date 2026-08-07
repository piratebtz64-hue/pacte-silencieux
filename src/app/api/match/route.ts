import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const pactId = body.pactId as string | undefined;

    if (!pactId) {
      return NextResponse.json({ error: 'pactId requis' }, { status: 400 });
    }

    const current = await prisma.pact.findUnique({ where: { id: pactId } });

    if (!current) {
      return NextResponse.json(
        { matched: false, error: 'Pacte introuvable', code: 'NOT_FOUND' },
        { status: 404 }
      );
    }

    // Déjà actif
    if (current.status === 'ACTIVE' && current.userBId) {
      return NextResponse.json({
        matched: true,
        pactId: current.id,
        status: 'ACTIVE',
      });
    }

    const userId = current.userAId;
    if (!userId) {
      return NextResponse.json({
        matched: false,
        status: current.status,
        message: 'Pacte sans utilisateur',
      });
    }

    // Déjà dans un pacte actif (comme A ou B)
    const alreadyActive = await prisma.pact.findFirst({
      where: {
        status: 'ACTIVE',
        OR: [{ userAId: userId }, { userBId: userId }],
      },
      orderBy: { startedAt: 'desc' },
    });
    if (alreadyActive) {
      return NextResponse.json({
        matched: true,
        pactId: alreadyActive.id,
        status: 'ACTIVE',
      });
    }

    // Si ce pacte n’est plus WAITING, on récupère le WAITING le plus récent de cet user
    let myWaiting = current;
    if (current.status !== 'WAITING') {
      const recent = await prisma.pact.findFirst({
        where: { userAId: userId, status: 'WAITING', userBId: null },
        orderBy: { createdAt: 'desc' },
      });
      if (!recent) {
        return NextResponse.json({
          matched: false,
          status: current.status,
          message: 'Pas de pacte en attente pour toi',
        });
      }
      myWaiting = recent;
    }

    // Compter les autres en attente (même durée)
    const candidates = await prisma.pact.findMany({
      where: {
        status: 'WAITING',
        durationDays: myWaiting.durationDays,
        userBId: null,
        id: { not: myWaiting.id },
        userAId: { not: userId },
      },
      orderBy: { createdAt: 'asc' },
      take: 5,
    });

    if (candidates.length === 0) {
      const totalWaiting = await prisma.pact.count({
        where: { status: 'WAITING', userBId: null },
      });
      return NextResponse.json({
        matched: false,
        status: 'WAITING',
        message:
          totalWaiting <= 1
            ? 'Personne d’autre en attente pour le moment…'
            : 'D’autres personnes attendent, mais pas la même durée. Choisissez la même (1, 3 ou 7 jours).',
        debug: {
          myDuration: myWaiting.durationDays,
          totalWaiting,
          sameDurationOthers: 0,
        },
      });
    }

    const partner = candidates[0];
    if (!partner.userAId) {
      return NextResponse.json({
        matched: false,
        status: 'WAITING',
        message: 'Partenaire invalide',
      });
    }

    const now = new Date();
    const endsAt = new Date(
      now.getTime() + myWaiting.durationDays * 24 * 60 * 60 * 1000
    );

    // Pacte principal = le plus ancien
    const primary =
      myWaiting.createdAt <= partner.createdAt ? myWaiting : partner;
    const secondary = primary.id === myWaiting.id ? partner : myWaiting;

    try {
      await prisma.$transaction([
        prisma.pact.update({
          where: { id: primary.id },
          data: {
            userAId: primary.userAId,
            userBId: secondary.userAId,
            status: 'ACTIVE',
            startedAt: now,
            endsAt,
          },
        }),
        prisma.pact.update({
          where: { id: secondary.id },
          data: { status: 'ENDED' },
        }),
        prisma.user.update({
          where: { id: primary.userAId! },
          data: { activePactId: primary.id, waitingSince: null },
        }),
        prisma.user.update({
          where: { id: secondary.userAId! },
          data: { activePactId: primary.id, waitingSince: null },
        }),
      ]);
    } catch (txErr) {
      // Race : l’autre téléphone a peut‑être déjà matché
      console.error('Match transaction race:', txErr);
      const retry = await prisma.pact.findFirst({
        where: {
          status: 'ACTIVE',
          OR: [{ userAId: userId }, { userBId: userId }],
        },
      });
      if (retry) {
        return NextResponse.json({
          matched: true,
          pactId: retry.id,
          status: 'ACTIVE',
        });
      }
      return NextResponse.json({
        matched: false,
        status: 'WAITING',
        message: 'Nouvelle tentative…',
      });
    }

    return NextResponse.json({
      matched: true,
      pactId: primary.id,
      status: 'ACTIVE',
      startedAt: now,
      endsAt,
    });
  } catch (error) {
    console.error('Match error:', error);
    return NextResponse.json(
      { matched: false, error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}
