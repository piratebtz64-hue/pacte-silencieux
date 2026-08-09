import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

const globalForPrisma = globalThis as unknown as { prismaHb?: PrismaClient };
const prisma =
  globalForPrisma.prismaHb ||
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error'] : [],
  });
if (process.env.NODE_ENV !== 'production') globalForPrisma.prismaHb = prisma;

/**
 * Heartbeat ultra-léger : prouve que l’onglet d’attente est encore ouvert.
 * Appelé toutes les ~25 s côté client — pas de logique de match ici.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const userId = body.userId as string | undefined;
    const pactId = body.pactId as string | undefined;

    let uid = userId;

    if (!uid && pactId) {
      const p = await prisma.pact.findUnique({
        where: { id: pactId },
        select: { userAId: true, status: true },
      });
      if (!p || p.status !== 'WAITING' || !p.userAId) {
        return NextResponse.json({ ok: false, reason: 'not_waiting' });
      }
      uid = p.userAId;
    }

    if (!uid) {
      return NextResponse.json({ error: 'userId ou pactId requis' }, { status: 400 });
    }

    const now = new Date();
    await prisma.user.update({
      where: { id: uid },
      data: { waitingSince: now, lastActiveAt: now },
    });

    return NextResponse.json({ ok: true, at: now.toISOString() });
  } catch (e) {
    console.error('heartbeat:', e);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
