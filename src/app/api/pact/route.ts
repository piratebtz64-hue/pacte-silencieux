import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const pactId = request.nextUrl.searchParams.get('pactId');

    if (!pactId) {
      return NextResponse.json(
        { error: 'ID de pacte requis' },
        { status: 400 }
      );
    }

    const pact = await prisma.pact.findUnique({
      where: { id: pactId },
      include: {
        userA: {
          select: { id: true, email: true },
        },
        userB: {
          select: { id: true, email: true },
        },
        gestures: {
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
      },
    });

    if (!pact) {
      return NextResponse.json(
        { error: 'Pacte non trouvé' },
        { status: 404 }
      );
    }

    return NextResponse.json(pact, { status: 200 });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}
