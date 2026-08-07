import { getAuthenticatedAppUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const pactId = request.nextUrl.searchParams.get('pactId');
    if (!pactId) {
      return NextResponse.json({ error: 'ID de pacte requis' }, { status: 400 });
    }

    const user = await getAuthenticatedAppUser();
    if (!user) {
      return NextResponse.json({ error: 'Authentification requise' }, { status: 401 });
    }

    const pact = await prisma.pact.findUnique({
      where: { id: pactId },
      include: { gestures: { orderBy: { createdAt: 'desc' }, take: 10 } },
    });

    if (!pact) {
      return NextResponse.json({ error: 'Pacte non trouvé' }, { status: 404 });
    }

    if (pact.userAId !== user.id && pact.userBId !== user.id) {
      return NextResponse.json({ error: 'Accès refusé' }, { status: 403 });
    }

    return NextResponse.json(pact);
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
