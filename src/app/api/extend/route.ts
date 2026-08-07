import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

const EXTEND_YES = 'system:extend:yes';
const EXTEND_NO = 'system:extend:no';
const EXTEND_CYCLE_MS = 7 * 24 * 60 * 60 * 1000;
const PROMPT_BEFORE_MS = 24 * 60 * 60 * 1000; // visible 24h avant la fin
const TIMEOUT_AFTER_MS = 48 * 60 * 60 * 1000; // 48h après endsAt sans double oui → fin

function isExtendOpening(id: string) {
  return id === EXTEND_YES || id === EXTEND_NO;
}

export async function GET(request: NextRequest) {
  try {
    const pactId = request.nextUrl.searchParams.get('pactId');
    const userId = request.nextUrl.searchParams.get('userId') || '';

    if (!pactId) {
      return NextResponse.json({ error: 'pactId requis' }, { status: 400 });
    }

    const pact = await prisma.pact.findUnique({ where: { id: pactId } });
    if (!pact) {
      return NextResponse.json({ error: 'Pacte introuvable' }, { status: 404 });
    }

    const now = new Date();
    const endsAt = pact.endsAt ? new Date(pact.endsAt) : null;

    const votes = await prisma.supportMessage.findMany({
      where: {
        pactId,
        openingId: { in: [EXTEND_YES, EXTEND_NO] },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Un vote par user (le plus récent du cycle courant — après last started/ends window)
    const byUser = new Map<string, { yes: boolean; at: Date }>();
    for (const v of votes) {
      if (!byUser.has(v.senderUserId)) {
        byUser.set(v.senderUserId, {
          yes: v.openingId === EXTEND_YES,
          at: v.createdAt,
        });
      }
    }

    const userAId = pact.userAId;
    const userBId = pact.userBId;
    const voteA = userAId ? byUser.get(userAId) : undefined;
    const voteB = userBId ? byUser.get(userBId) : undefined;

    const myVote = userId ? byUser.get(userId) : undefined;
    const bothVoted = !!(voteA && voteB);

    // Fenêtre d’affichage du prompt
    let phase: 'hidden' | 'prompt' | 'waiting_other' | 'extended' | 'ended' |
      'timeout' = 'hidden';

    if (pact.status === 'ENDED') {
      phase = 'ended';
    } else if (pact.status === 'ACTIVE' && endsAt) {
      const promptStart = new Date(endsAt.getTime() - PROMPT_BEFORE_MS);
      const timeoutAt = new Date(endsAt.getTime() + TIMEOUT_AFTER_MS);

      if (bothVoted) {
        if (voteA!.yes && voteB!.yes) {
          phase = 'extended'; // sera traité au POST ou ici en auto-extend
        } else {
          phase = 'ended';
        }
      } else if (now >= promptStart) {
        if (myVote) phase = 'waiting_other';
        else phase = 'prompt';
      }

      // Timeout : past endsAt + 48h without both yes → end
      if (now > timeoutAt && !(voteA?.yes && voteB?.yes)) {
        if (pact.status === 'ACTIVE') {
          await prisma.pact.update({
            where: { id: pactId },
            data: { status: 'ENDED' },
          });
        }
        phase = 'timeout';
      }

      // Auto-extend if both yes and still near end
      if (bothVoted && voteA!.yes && voteB!.yes && endsAt <= now) {
        const newEnds = new Date(now.getTime() + EXTEND_CYCLE_MS);
        await prisma.pact.update({
          where: { id: pactId },
          data: { endsAt: newEnds, status: 'ACTIVE' },
        });
        // Clear votes for next cycle by not deleting — we filter by createdAt after old endsAt next time
        // Mark extension with a system note
        await prisma.supportMessage.create({
          data: {
            pactId,
            senderUserId: userAId!,
            receiverUserId: userBId!,
            openingId: 'system:extend:done',
            openingText:
              'Vous avez tous les deux choisi de continuer. Pacte prolongé de 7 jours.',
          },
        }).catch(() => {});
        phase = 'extended';
      }
    }

    return NextResponse.json({
      phase,
      endsAt: pact.endsAt,
      status: pact.status,
      myVote: myVote ? (myVote.yes ? 'yes' : 'no') : null,
      bothVoted,
      // Ne jamais révéler le vote de l’autre avant la fin
      otherVoted: userId
        ? !!(userId === userAId ? voteB : voteA)
        : false,
    });
  } catch (error) {
    console.error('Extend GET error:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const pactId = String(body.pactId || '').trim();
    const userId = String(body.userId || '').trim();
    const vote = body.vote === 'yes' || body.vote === true ? 'yes' : 'no';

    if (!pactId || !userId) {
      return NextResponse.json(
        { error: 'pactId et userId requis' },
        { status: 400 }
      );
    }

    const pact = await prisma.pact.findUnique({ where: { id: pactId } });
    if (!pact || pact.status !== 'ACTIVE') {
      return NextResponse.json({ error: 'Pacte non actif' }, { status: 400 });
    }
    if (userId !== pact.userAId && userId !== pact.userBId) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 403 });
    }
    if (!pact.userAId || !pact.userBId) {
      return NextResponse.json({ error: 'Pacte incomplet' }, { status: 400 });
    }

    const endsAt = pact.endsAt ? new Date(pact.endsAt) : null;
    const now = new Date();
    if (endsAt) {
      const promptStart = new Date(endsAt.getTime() - PROMPT_BEFORE_MS);
      if (now < promptStart) {
        return NextResponse.json(
          { error: 'La proposition de prolongation n’est pas encore ouverte' },
          { status: 400 }
        );
      }
    }

    // Empêcher double vote (même cycle)
    const existing = await prisma.supportMessage.findFirst({
      where: {
        pactId,
        senderUserId: userId,
        openingId: { in: [EXTEND_YES, EXTEND_NO] },
        createdAt: endsAt
          ? { gte: new Date(endsAt.getTime() - PROMPT_BEFORE_MS) }
          : undefined,
      },
    });
    if (existing) {
      return NextResponse.json(
        { error: 'Tu as déjà voté pour ce cycle' },
        { status: 400 }
      );
    }

    const receiverUserId =
      userId === pact.userAId ? pact.userBId : pact.userAId;

    await prisma.supportMessage.create({
      data: {
        pactId,
        senderUserId: userId,
        receiverUserId,
        openingId: vote === 'yes' ? EXTEND_YES : EXTEND_NO,
        openingText:
          vote === 'yes'
            ? 'A choisi de prolonger le pacte (vote confidentiel).'
            : 'A choisi de ne pas prolonger (vote confidentiel).',
      },
    });

    // Recharger votes du cycle
    const votes = await prisma.supportMessage.findMany({
      where: {
        pactId,
        openingId: { in: [EXTEND_YES, EXTEND_NO] },
        createdAt: endsAt
          ? { gte: new Date(endsAt.getTime() - PROMPT_BEFORE_MS) }
          : undefined,
      },
    });

    const byUser = new Map<string, boolean>();
    for (const v of votes) {
      if (!byUser.has(v.senderUserId)) {
        byUser.set(v.senderUserId, v.openingId === EXTEND_YES);
      }
    }

    const a = byUser.get(pact.userAId);
    const b = byUser.get(pact.userBId);

    let result: 'waiting' | 'extended' | 'ended' = 'waiting';

    if (a !== undefined && b !== undefined) {
      if (a && b) {
        const base = endsAt && endsAt > now ? endsAt : now;
        const newEnds = new Date(base.getTime() + EXTEND_CYCLE_MS);
        await prisma.pact.update({
          where: { id: pactId },
          data: { endsAt: newEnds, status: 'ACTIVE' },
        });
        await prisma.supportMessage.create({
          data: {
            pactId,
            senderUserId: pact.userAId,
            receiverUserId: pact.userBId,
            openingId: 'system:extend:done',
            openingText:
              'Vous avez tous les deux accepté. Le pacte est prolongé de 7 jours. L’historique est conservé.',
          },
        });
        result = 'extended';
      } else {
        await prisma.pact.update({
          where: { id: pactId },
          data: { status: 'ENDED' },
        });
        await prisma.supportMessage.create({
          data: {
            pactId,
            senderUserId: pact.userAId,
            receiverUserId: pact.userBId,
            openingId: 'system:extend:ended',
            openingText:
              'Le pacte se termine ici. Merci pour le temps partagé. Ce n’est pas un échec.',
          },
        });
        result = 'ended';
      }
    }

    return NextResponse.json({
      ok: true,
      result,
      myVote: vote,
    });
  } catch (error) {
    console.error('Extend POST error:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
