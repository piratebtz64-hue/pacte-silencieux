import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';
import { getMessageById } from '@/lib/messages';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const pactId = request.nextUrl.searchParams.get('pactId');
    if (!pactId) {
      return NextResponse.json({ error: 'pactId requis' }, { status: 400 });
    }

    const messages = await prisma.supportMessage.findMany({
      where: { pactId },
      orderBy: { createdAt: 'asc' },
    });

    return NextResponse.json({ messages });
  } catch (error) {
    console.error('Support GET error:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { pactId, senderUserId, openingId, responseText, messageId } = body;

    // Répondre à un message existant
    if (messageId && responseText) {
      const existing = await prisma.supportMessage.findUnique({
        where: { id: messageId },
      });
      if (!existing) {
        return NextResponse.json({ error: 'Message introuvable' }, { status: 404 });
      }
      if (existing.responseText) {
        return NextResponse.json({ error: 'Déjà répondu' }, { status: 400 });
      }

      const opening = getMessageById(existing.openingId);
      if (opening && !opening.responses.includes(responseText)) {
        return NextResponse.json({ error: 'Réponse non autorisée' }, { status: 400 });
      }

      const updated = await prisma.supportMessage.update({
        where: { id: messageId },
        data: { responseText, respondedAt: new Date() },
      });

      return NextResponse.json({ message: updated });
    }

    if (!pactId || !senderUserId || !openingId) {
      return NextResponse.json(
        { error: 'pactId, senderUserId et openingId requis' },
        { status: 400 }
      );
    }

    const opening = getMessageById(openingId);
    if (!opening) {
      return NextResponse.json({ error: 'Message invalide' }, { status: 400 });
    }

    const pact = await prisma.pact.findUnique({ where: { id: pactId } });
    if (!pact || pact.status !== 'ACTIVE') {
      return NextResponse.json({ error: 'Pacte non actif' }, { status: 400 });
    }

    const receiverUserId =
      pact.userAId === senderUserId ? pact.userBId : pact.userAId;
    if (!receiverUserId) {
      return NextResponse.json({ error: 'Destinataire introuvable' }, { status: 400 });
    }

    // Pas de limite de messages — échanges illimités pendant le pacte
    const created = await prisma.supportMessage.create({
      data: {
        pactId,
        senderUserId,
        receiverUserId,
        openingId: opening.id,
        openingText: opening.text,
      },
    });

    return NextResponse.json({ message: created }, { status: 201 });
  } catch (error) {
    console.error('Support POST error:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
