import { getAuthenticatedAppUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

const validGestures = ['JE_SUIS_LA', 'JE_TIENS', 'AUJOURDHUI_FRAGILE', 'JE_VEILLE_AVEC_TOI'] as const;

export async function POST(request: NextRequest) {
  try {
    const { pactId, gestureType } = await request.json();
    if (!pactId || !validGestures.includes(gestureType)) {
      return NextResponse.json({ error: 'Données invalides' }, { status: 400 });
    }

    const user = await getAuthenticatedAppUser();
    if (!user) {
      return NextResponse.json({ error: 'Authentification requise' }, { status: 401 });
    }

    const pact = await prisma.pact.findUnique({ where: { id: pactId } });
    if (!pact) return NextResponse.json({ error: 'Pacte non trouvé' }, { status: 404 });
    if (pact.status !== 'ACTIVE') {
      return NextResponse.json({ error: "Le pacte n'est pas actif" }, { status: 400 });
    }

    const receiverId = pact.userAId === user.id ? pact.userBId : pact.userBId === user.id ? pact.userAId : null;
    if (!receiverId) return NextResponse.json({ error: 'Accès refusé' }, { status: 403 });

    const gesture = await prisma.gesture.create({
      data: { pactId, senderUserId: user.id, receiverUserId: receiverId, type: gestureType },
    });
    return NextResponse.json(gesture, { status: 201 });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
