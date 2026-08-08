import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';
import { notifyPactMatched } from '@/lib/notify-email';

const prisma = new PrismaClient();

/** Un pacte en attente expire après 20 minutes sans match */
const WAITING_MAX_MS = 20 * 60 * 1000;

function isRealActive(
  p: {
    status: string;
    userAId: string | null;
    userBId: string | null;
    endsAt: Date | null;
  },
  now: Date
) {
  return (
    p.status === 'ACTIVE' &&
    !!p.userAId &&
    !!p.userBId &&
    p.userAId !== p.userBId &&
    !!p.endsAt &&
    p.endsAt > now
  );
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const pactId = body.pactId as string | undefined;
    const action = (body.action as string | undefined) || 'match';

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

    // Annuler l’attente volontairement
    if (action === 'leave') {
      if (current.status === 'WAITING') {
        await prisma.pact.update({
          where: { id: current.id },
          data: { status: 'ENDED' },
        });
        if (current.userAId) {
          await prisma.user
            .update({
              where: { id: current.userAId },
              data: { waitingSince: null },
            })
            .catch(() => {});
        }
      }
      return NextResponse.json({ left: true, matched: false });
    }

    // Déjà un vrai pacte actif à deux personnes distinctes
    if (isRealActive(current, now)) {
      return NextResponse.json({
        matched: true,
        pactId: current.id,
        status: 'ACTIVE',
      });
    }

    // ACTIVE incohérent (un seul user, dates mortes…) → clôturer
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
        alone: true,
      });
    }

    // Un autre pacte ACTIVE réel pour cet utilisateur ?
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

    if (alreadyActive && isRealActive(alreadyActive, now)) {
      return NextResponse.json({
        matched: true,
        pactId: alreadyActive.id,
        status: 'ACTIVE',
      });
    }

    // Nettoyer les attentes expirées
    await prisma.pact
      .updateMany({
        where: {
          status: 'WAITING',
          createdAt: { lt: waitingSinceCutoff },
        },
        data: { status: 'ENDED' },
      })
      .catch(() => {});

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
          alone: true,
          message: 'Tu es seul·e dans la file pour l’instant.',
          code: 'WAITING',
          debug: {
            myDuration: current.durationDays,
            totalWaiting: 0,
            sameDurationOthers: 0,
          },
        });
      }
      myWaiting = recent;
    }

    // Heartbeat : garder l’attente « vivante »
    await prisma.user
      .update({
        where: { id: userId },
        data: { waitingSince: now },
      })
      .catch(() => {});

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
      take: 8,
    });

    const validPartners = candidates.filter(
      (c) =>
        !!c.userAId &&
        c.userAId !== userId &&
        c.userAId !== myWaiting.userAId
    );

    const totalRecent = await prisma.pact.count({
      where: {
        status: 'WAITING',
        userBId: null,
        createdAt: { gte: waitingSinceCutoff },
      },
    });

    if (validPartners.length === 0) {
      return NextResponse.json({
        matched: false,
        status: 'WAITING',
        alone: totalRecent <= 1,
        message:
          totalRecent <= 1
            ? 'Tu es seul·e dans la file. Garde cette page ouverte : dès qu’une autre personne choisit la même durée, le lien se fait.'
            : 'D’autres personnes attendent, mais pas avec la même durée. Les deux côtés doivent choisir 1, 3 ou 7 jours identiques.',
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
        alone: false,
        message: 'Nouvelle tentative…',
      });
    }

    // Double sécurité : jamais le même user des deux côtés
    if (partner.userAId === myWaiting.userAId) {
      return NextResponse.json({
        matched: false,
        status: 'WAITING',
        alone: true,
        message: 'Tu es seul·e dans la file pour l’instant.',
      });
    }

    const endsAt = new Date(
      now.getTime() + myWaiting.durationDays * 24 * 60 * 60 * 1000
    );

    const primary =
      myWaiting.createdAt <= partner.createdAt ? myWaiting : partner;
    const secondary = primary.id === myWaiting.id ? partner : myWaiting;

    if (!primary.userAId || !secondary.userAId || primary.userAId === secondary.userAId) {
      return NextResponse.json({
        matched: false,
        status: 'WAITING',
        alone: true,
        message: 'Tu es seul·e dans la file pour l’instant.',
      });
    }

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
          where: { id: primary.userAId },
          data: { activePactId: primary.id, waitingSince: null },
        }),
        prisma.user.update({
          where: { id: secondary.userAId },
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

    try {
      const users = await prisma.user.findMany({
        where: { id: { in: [primary.userAId, secondary.userAId] } },
        select: { email: true },
      });
      await Promise.all(
        users.map((u) => notifyPactMatched(u.email, primary.id))
      );
    } catch (e) {
      console.error('Notify match:', e);
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
