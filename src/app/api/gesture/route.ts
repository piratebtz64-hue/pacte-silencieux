import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

const VALID = [
  'JE_SUIS_LA',
  'JE_TIENS',
  'AUJOURDHUI_FRAGILE',
  'JE_VEILLE_AVEC_TOI',
] as const;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    // Accepte type OU gestureType (compat frontend)
    const pactId = body.pactId as string | undefined;
    const gestureType = (body.type || body.gestureType) as string | undefined;
    const senderUserId = body.senderUserId as string | undefined;

    if (!pactId || !gestureType) {
      return NextResponse.json(
        { error: 'ID de pacte et type de geste requis' },
        { status: 400 }
      );
    }

    if (!VALID.includes(gestureType as (typeof VALID)[number])) {
      return NextResponse.json(
        { error: 'Type de geste invalide' },
        { status: 400 }
      );
    }

    const pact = await prisma.pact.findUnique({ where: { id: pactId } });

    if (!pact) {
      return NextResponse.json({ error: 'Pacte non trouvé' }, { status: 404 });
    }

    if (pact.status !== 'ACTIVE') {
      return NextResponse.json(
        { error: "Le pacte n'est pas actif" },
        { status: 400 }
      );
    }

    if (!pact.userAId || !pact.userBId) {
      return NextResponse.json({ error: 'Pacte incomplet' }, { status: 400 });
    }

    // Déterminer l'expéditeur (celui qui clique)
    let senderId = senderUserId;
    if (
      !senderId ||
      (senderId !== pact.userAId && senderId !== pact.userBId)
    ) {
      // Fallback : userA si pas d'id valide côté client
      senderId = pact.userAId;
    }

    const receiverId =
      senderId === pact.userAId ? pact.userBId : pact.userAId;

    const gesture = await prisma.gesture.create({
      data: {
        pactId,
        senderUserId: senderId,
        receiverUserId: receiverId,
        type: gestureType as (typeof VALID)[number],
      },
    });

    return NextResponse.json(
      { ok: true, gesture, message: 'Geste envoyé' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Gesture API error:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const pactId = request.nextUrl.searchParams.get('pactId');
    if (!pactId) {
      return NextResponse.json({ error: 'pactId requis' }, { status: 400 });
    }

    const gestures = await prisma.gesture.findMany({
      where: { pactId },
      orderBy: { createdAt: 'asc' },
    });

    return NextResponse.json({ gestures });
  } catch (error) {
    console.error('Gesture GET error:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
