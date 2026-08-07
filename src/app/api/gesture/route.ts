import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

const GESTURE_LABELS: Record<string, string> = {
  JE_SUIS_LA: 'Je suis là.',
  JE_TIENS: 'Je tiens.',
  AUJOURDHUI_FRAGILE: 'Aujourd’hui c’est fragile.',
  JE_VEILLE_AVEC_TOI: 'Je veille un peu avec toi.',
};

export async function POST(request: NextRequest) {
  try {
    let body: Record<string, unknown> = {};
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: 'Requête invalide' }, { status: 400 });
    }

    const pactId = String(body.pactId || '').trim();
    const gestureType = String(
      body.type || body.gestureType || ''
    ).trim();
    let senderUserId = String(body.senderUserId || '').trim();

    if (!pactId) {
      return NextResponse.json({ error: 'ID de pacte manquant' }, { status: 400 });
    }
    if (!gestureType || !GESTURE_LABELS[gestureType]) {
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
      return NextResponse.json(
        { error: 'Pacte incomplet' },
        { status: 400 }
      );
    }

    if (senderUserId !== pact.userAId && senderUserId !== pact.userBId) {
      senderUserId = pact.userAId;
    }
    const receiverUserId =
      senderUserId === pact.userAId ? pact.userBId : pact.userAId;

    const label = GESTURE_LABELS[gestureType];

    // Enregistrement fiable via SupportMessage (même table que les messages)
    // openingId préfixé gesture: pour les distinguer dans le fil
    const message = await prisma.supportMessage.create({
      data: {
        pactId,
        senderUserId,
        receiverUserId,
        openingId: `gesture:${gestureType}`,
        openingText: label,
        responseText: null,
      },
    });

    // Best-effort aussi dans la table Gesture si elle existe
    try {
      await prisma.gesture.create({
        data: {
          pactId,
          senderUserId,
          receiverUserId,
          type: gestureType as 'JE_SUIS_LA' | 'JE_TIENS' | 'AUJOURDHUI_FRAGILE' | 'JE_VEILLE_AVEC_TOI',
        },
      });
    } catch {
      // ignore si table/enum KO
    }

    return NextResponse.json(
      { ok: true, message, gestureLabel: label },
      { status: 201 }
    );
  } catch (error) {
    console.error('Gesture error:', error);
    return NextResponse.json(
      {
        error: 'Erreur serveur',
        detail: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const pactId = request.nextUrl.searchParams.get('pactId');
    if (!pactId) {
      return NextResponse.json({ error: 'pactId requis' }, { status: 400 });
    }

    // Gestes = messages dont openingId commence par gesture:
    const gestures = await prisma.supportMessage.findMany({
      where: {
        pactId,
        openingId: { startsWith: 'gesture:' },
      },
      orderBy: { createdAt: 'asc' },
    });

    return NextResponse.json({ gestures });
  } catch (error) {
    console.error('Gesture GET error:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
