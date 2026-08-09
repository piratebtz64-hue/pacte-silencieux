import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';
import { notifyPactMatched } from '@/lib/notify-email';
import { notifyMatchRealtime } from '@/lib/realtime';

const globalForPrisma = globalThis as unknown as { prismaMatch?: PrismaClient };
const prisma =
  globalForPrisma.prismaMatch ||
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error'] : [],
  });
if (process.env.NODE_ENV !== 'production') globalForPrisma.prismaMatch = prisma;

/** File max : au-delà, le WAITING est considéré abandonné */
const WAITING_MAX_MS = 20 * 60 * 1000;
/** Le partenaire doit avoir envoyé un heartbeat il y a moins de 90 s */
const HEARTBEAT_MAX_MS = 90 * 1000;

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
  const started = Date.now();
  try {
    const body = await request.json().catch(() => ({}));
    const pactId = body.pactId as string | undefined;
    const action = (body.action as string | undefined) || 'match';

    if (!pactId) {
      return NextResponse.json({ error: 'pactId requis' }, { status: 400 });
    }

    const now = new Date();
    const waitingSinceCutoff = new Date(now.getTime() - WAITING_MAX_MS);
    const heartbeatCutoff = new Date(now.getTime() - HEARTBEAT_MAX_MS);

    if (action === 'leave' || action === 'disconnect') {
      const current = await prisma.pact.findUnique({
        where: { id: pactId },
        select: { id: true, status: true, userAId: true },
      });
      if (current?.status === 'WAITING') {
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
      return NextResponse.json({
        left: true,
        matched: false,
        reason: action,
        ms: Date.now() - started,
      });
    }

    const current = await prisma.pact.findUnique({ where: { id: pactId } });

    if (!current) {
      return NextResponse.json(
        { matched: false, error: 'Pacte introuvable', code: 'NOT_FOUND' },
        { status: 404 }
      );
    }

    if (isRealActive(current, now)) {
      return NextResponse.json({
        matched: true,
        pactId: current.id,
        status: 'ACTIVE',
        ms: Date.now() - started,
      });
    }

    // ACTIVE invalide (même user des deux côtés, ou incomplet)
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
        alone: true,
        message: 'Pacte sans utilisateur',
        ms: Date.now() - started,
      });
    }

    // Reprise uniquement d’un vrai pacte à deux personnes distinctes
    const alreadyActive = await prisma.pact.findFirst({
      where: {
        status: 'ACTIVE',
        endsAt: { gt: now },
        userAId: { not: null },
        userBId: { not: null },
        OR: [{ userAId: userId }, { userBId: userId }],
      },
      select: {
        id: true,
        status: true,
        userAId: true,
        userBId: true,
        endsAt: true,
      },
      orderBy: { startedAt: 'desc' },
    });

    if (
      alreadyActive &&
      isRealActive(alreadyActive, now) &&
      alreadyActive.userAId !== alreadyActive.userBId
    ) {
      return NextResponse.json({
        matched: true,
        pactId: alreadyActive.id,
        status: 'ACTIVE',
        ms: Date.now() - started,
      });
    }

    // Sinon terminer les ACTIVE fantômes de cet user
    if (alreadyActive) {
      await prisma.pact
        .update({
          where: { id: alreadyActive.id },
          data: { status: 'ENDED' },
        })
        .catch(() => {});
    }

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
        void prisma.pact
          .updateMany({
            where: {
              status: 'WAITING',
              createdAt: { lt: waitingSinceCutoff },
            },
            data: { status: 'ENDED' },
          })
          .catch(() => {});

        return NextResponse.json({
          matched: false,
          status: 'WAITING',
          alone: true,
          message: 'Tu es seul(e) dans la file pour l’instant.',
          code: 'WAITING',
          debug: {
            myDuration: current.durationDays,
            totalWaiting: 0,
            sameDurationOthers: 0,
            livePartners: 0,
          },
          ms: Date.now() - started,
        });
      }
      myWaiting = recent;
    }

    // Heartbeat : prouve que CET onglet est encore ouvert
    await prisma.user
      .update({
        where: { id: userId },
        data: { waitingSince: now, lastActiveAt: now },
      })
      .catch(() => {});

    // Candidats : même durée + autre user + heartbeat récent (< 90 s)
    const candidates = await prisma.pact.findMany({
      where: {
        status: 'WAITING',
        durationDays: myWaiting.durationDays,
        userBId: null,
        id: { not: myWaiting.id },
        userAId: { not: userId },
        createdAt: { gte: waitingSinceCutoff },
        userA: {
          is: {
            waitingSince: { gte: heartbeatCutoff },
          },
        },
      },
      orderBy: { createdAt: 'asc' },
      take: 8,
      select: {
        id: true,
        userAId: true,
        createdAt: true,
        durationDays: true,
        userA: { select: { id: true, waitingSince: true } },
      },
    });

    const totalRecent = await prisma.pact.count({
      where: {
        status: 'WAITING',
        userBId: null,
        createdAt: { gte: waitingSinceCutoff },
      },
    });

    void prisma.pact
      .updateMany({
        where: { status: 'WAITING', createdAt: { lt: waitingSinceCutoff } },
        data: { status: 'ENDED' },
      })
      .catch(() => {});

    const validPartners = candidates.filter((c) => {
      if (!c.userAId || c.userAId === userId || c.userAId === myWaiting.userAId)
        return false;
      const ws = c.userA?.waitingSince;
      if (!ws) return false;
      return ws.getTime() >= heartbeatCutoff.getTime();
    });

    if (validPartners.length === 0) {
      return NextResponse.json({
        matched: false,
        status: 'WAITING',
        alone: true,
        message:
          totalRecent <= 1
            ? 'Tu es seul(e) dans la file. Garde cette page ouverte.'
            : 'Personne d’autre n’est actif en ce moment avec la même durée. Garde la page ouverte.',
        debug: {
          myDuration: myWaiting.durationDays,
          totalWaiting: totalRecent,
          sameDurationOthers: candidates.length,
          livePartners: 0,
        },
        ms: Date.now() - started,
      });
    }

    const partner = validPartners[0];
    if (
      !partner.userAId ||
      !myWaiting.userAId ||
      partner.userAId === myWaiting.userAId
    ) {
      return NextResponse.json({
        matched: false,
        status: 'WAITING',
        alone: true,
        message: 'Tu es seul(e) dans la file pour l’instant.',
        ms: Date.now() - started,
      });
    }

    const endsAt = new Date(
      now.getTime() + myWaiting.durationDays * 24 * 60 * 60 * 1000
    );

    const primary =
      myWaiting.createdAt <= partner.createdAt ? myWaiting : partner;
    const secondary = primary.id === myWaiting.id ? partner : myWaiting;

    const aId = primary.userAId!;
    const bId = secondary.userAId!;
    if (aId === bId) {
      return NextResponse.json({
        matched: false,
        status: 'WAITING',
        alone: true,
        message: 'Tu es seul(e) dans la file pour l’instant.',
        ms: Date.now() - started,
      });
    }

    // Double-check : le partenaire a toujours un heartbeat frais
    const partnerUser = await prisma.user.findUnique({
      where: { id: bId === userId ? aId : bId },
      select: { waitingSince: true },
    });
    if (
      !partnerUser?.waitingSince ||
      partnerUser.waitingSince.getTime() < heartbeatCutoff.getTime()
    ) {
      return NextResponse.json({
        matched: false,
        status: 'WAITING',
        alone: true,
        message: 'La présence s’est déconnectée. On continue d’attendre…',
        ms: Date.now() - started,
      });
    }

    try {
      await prisma.$transaction([
        prisma.pact.update({
          where: { id: primary.id },
          data: {
            userAId: aId,
            userBId: bId,
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
          where: { id: aId },
          data: { activePactId: primary.id, waitingSince: null },
        }),
        prisma.user.update({
          where: { id: bId },
          data: { activePactId: primary.id, waitingSince: null },
        }),
      ]);
    } catch (txErr) {
      console.error('Match transaction race:', txErr);
      return NextResponse.json({
        matched: false,
        status: 'WAITING',
        message: 'Nouvelle tentative…',
        ms: Date.now() - started,
      });
    }

    void (async () => {
      try {
        await notifyMatchRealtime([myWaiting.id, partner.id], primary.id);
      } catch (e) {
        console.error('Realtime match:', e);
      }
      try {
        const users = await prisma.user.findMany({
          where: { id: { in: [aId, bId] } },
          select: { email: true },
        });
        await Promise.all(
          users.map((u) => notifyPactMatched(u.email, primary.id))
        );
      } catch (e) {
        console.error('Notify match:', e);
      }
    })();

    return NextResponse.json({
      matched: true,
      pactId: primary.id,
      status: 'ACTIVE',
      startedAt: now,
      endsAt,
      ms: Date.now() - started,
    });
  } catch (error) {
    console.error('Match error:', error);
    return NextResponse.json(
      { matched: false, error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}
