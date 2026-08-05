import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const { pactId, gestureType } = await request.json();

    if (!pactId || !gestureType) {
      return NextResponse.json(
        { error: 'ID de pacte et type de geste requis' },
        { status: 400 }
      );
    }

    const validGestures = [
      'JE_SUIS_LA',
      'JE_TIENS',
      'AUJOURDHUI_FRAGILE',
      'JE_VEILLE_AVEC_TOI',
    ];

    if (!validGestures.includes(gestureType)) {
      return NextResponse.json(
        { error: 'Type de geste invalide' },
        { status: 400 }
      );
    }

    const pact = await prisma.pact.findUnique({
      where: { id: pactId },
    });

    if (!pact) {
      return NextResponse.json(
        { error: 'Pacte non trouvé' },
        { status: 404 }
      );
    }

    if (pact.status !== 'ACTIVE') {
      return NextResponse.json(
        { error: 'Le pacte n\'est pas actif' },
        { status: 400 }
      );
    }

    // Determine sender and receiver
    const senderId = pact.userAId;
    const receiverId = pact.userBId;

    if (!senderId || !receiverId) {
      return NextResponse.json(
        { error: 'Pacte incomplet' },
        { status: 400 }
      );
    }

    // Create gesture
    const gesture = await prisma.gesture.create({
      data: {
        pactId,
        senderUserId: senderId,
        receiverUserId: receiverId,
        type: gestureType as any,
      },
    });

    return NextResponse.json(gesture, { status: 201 });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}
