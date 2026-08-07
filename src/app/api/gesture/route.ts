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
    let body: Record<string, unknown> = {};
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: 'Corps de requête invalide' },
        { status: 400 }
      );
    }

    const pactId = String(body.pactId || body.pact_id || '').trim();
    const gestureType = String(
      body.type || body.gestureType || body.gesture_type || ''
    ).trim();
    const senderUserId = String(body.senderUserId || body.sender_user_id || '').trim();

    if (!pactId) {
      return NextResponse.json(
        { error: 'ID de pacte manquant' },
        { status: 400 }
      );
    }
    if (!gestureType) {
      return NextResponse.json(
        { error: 'Type de geste manquant' },
        { status: 400 }
      );
    }
    if (!VALID.includes(gestureType as (typeof VALID)[number])) {
      return NextResponse.json(
        { error: `Type de geste invalide: ${gestureType}` },
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
        { error: 'Pacte incomplet (en attente de la 2e personne)' },
        { status: 400 }
      );
    }

    let senderId = senderUserId;
    if (senderId !== pact.userAId && senderId !== pact.userBId) {
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
