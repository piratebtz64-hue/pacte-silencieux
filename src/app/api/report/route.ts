import { getAuthenticatedAppUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { pactId, reason } = await request.json();
    if (!pactId || typeof reason !== 'string' || !reason.trim()) {
      return NextResponse.json({ error: 'Données manquantes' }, { status: 400 });
    }

    const user = await getAuthenticatedAppUser();
    if (!user) {
      return NextResponse.json({ error: 'Authentification requise' }, { status: 401 });
    }

    const pact = await prisma.pact.findUnique({ where: { id: pactId } });
    if (!pact || (pact.userAId !== user.id && pact.userBId !== user.id)) {
      return NextResponse.json({ error: 'Accès refusé' }, { status: 403 });
    }

    const report = await prisma.report.create({ data: { pactId, userId: user.id, reason: reason.trim() } });
    return NextResponse.json(report, { status: 201 });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
