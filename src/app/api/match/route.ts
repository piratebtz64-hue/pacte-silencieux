import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

/** Un pacte en attente expire après 20 minutes sans match */
const WAITING_MAX_MS = 20 * 60 * 1000;

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

    const now = new Date();
    const waitingSinceCutoff = new Date(now.getTime() - WAITING_MAX_MS);

    // Déjà ACTIVE avec DEUX personnes réelles + encore valide
    if (
      current.status === 'ACTIVE' &&
      current.userAId &&
      current.userBId &&
      current.userAId !== current.userBId &&
      current.endsAt &&
      current.endsAt > now
    ) {
      return NextResponse.json({
        matched: true,
        pactId: current.id,
        status: 'ACTIVE',
      });
    }

    // Si ACTIVE invalide (un seul user, ou expiré) → forcer WAITING / ENDED
    if (current.status === 'ACTIVE') {
      await prisma.pact.update({
        where: { id: current.id },
        data: { status: 'ENDED' },
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

    // Ne réutiliser un ACTIVE existant QUE s’il a vraiment 2 personnes distinctes
    const alreadyActive = await prisma.pact.findFirst({
      where: {
        status: 'ACTIVE',
        endsAt: { gt: now },
        userAId: { not: null },
        userBId: { not: null },
        OR: [{ userAId: userId }, { userBId: userId }],
      },
      orderBy: { startedAt: 'desc' },
    });

    if (
      alreadyActive &&
      alreadyActive.userAId &&
      alreadyActive.userBId &&
      alreadyActive.userAId !== alreadyActive.userBId
    ) {
      return NextResponse.json({
        matched: true,
        pactId: alreadyActive.id,
        status: 'ACTIVE',
      });
    }

    // Mon pacte doit être WAITING et récent
    let myWaiting = current;
    if (current.status !== 'WAITING' || current.createdAt < waitingSinceCutoff) {
      const recent = await prisma.pact.findFirst({
        where: {
          userAId: userId,
          status: 'WAITING',
          userBId: null,
          createdAt: { gte: waitingSinceCutoff },
        },
        orderBy: { createdAt: 'desc' },
      });
      if (!recent) {
        return NextResponse.json({
          matched: false,
          status: 'WAITING',
          message:
            'Personne d’autre en attente. Reste sur cette page ou recommence depuis le début.',
          code: 'WAITING',
        });
      }
      myWaiting = recent;
    }

    // Expirer les vieux WAITING
    await prisma.pact
      .updateMany({
        where: {
          status: 'WAITING',
          createdAt: { lt: waitingSinceCutoff },
        },
        data: { status: 'ENDED' },
      })
      .catch(() => {});

    // Partenaires RÉELS : même durée, autre user, WAITING récent, pas soi-même
    const candidates = await prisma.pact.findMany({
      where: {
        status: 'WAITING',
        durationDays: myWaiting.durationDays,
        userBId: null,
        id: { not: myWaiting.id },
        userAId: { not: userId },
        createdAt: { gte: waitingSinceCutoff },
      },
      orderBy: { createdAt: 'asc' },
      take: 5,
    });

    // Filtrer encore une fois (sécurité)
    const validPartners = candidates.filter(
      (c) => c.userAId && c.userAId !== userId && c.userAId !== myWaiting.userAId
    );

    if (validPartners.length === 0) {
      const totalRecent = await prisma.pact.count({
        where: {
          status: 'WAITING',
          userBId: null,
          createdAt: { gte: waitingSinceCutoff },
        },
      });
      return NextResponse.json({
        matched: false,
        status: 'WAITING',
        message:
          totalRecent <= 1
            ? 'Personne d’autre en attente pour le moment…'
            : 'D’autres personnes attendent, mais pas la même durée. Choisissez la même durée (1, 3 ou 7 jours).',
        debug: {
          myDuration: myWaiting.durationDays,
          totalWaiting: totalRecent,
          sameDurationOthers: 0,
        },
      });
    }

    const partner = validPartners[0];
    if (!partner.userAId || !myWaiting.userAId) {
      return NextResponse.json({
        matched: false,
        status: 'WAITING',
        message: 'Partenaire invalide',
      });
    }

    const endsAt = new Date(
      now.getTime() + myWaiting.durationDays * 24 * 60 * 60 * 1000
    );

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
      console.error('Match transaction race:', txErr);
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
