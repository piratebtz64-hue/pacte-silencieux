import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import { hashPassword, verifyPassword, isStrongEnough } from '@/lib/password';

const prisma = new PrismaClient();

/** Vérifie si un compte a déjà un mot de passe */
export async function GET(request: NextRequest) {
  try {
    const email = request.nextUrl.searchParams.get('email')?.toLowerCase().trim();
    if (!email) {
      return NextResponse.json({ error: 'Email requis' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true, passwordHash: true },
    });

    return NextResponse.json({
      exists: !!user,
      hasPassword: !!(user && user.passwordHash),
    });
  } catch (error) {
    console.error('Password GET:', error);
    // Colonne absente → traiter comme pas de mdp
    return NextResponse.json({ exists: false, hasPassword: false });
  }
}

/** Créer / vérifier mot de passe + session */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const email = String(body.email || '')
      .toLowerCase()
      .trim();
    const password = String(body.password || '');
    const mode = body.mode === 'login' ? 'login' : 'register';

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email et mot de passe requis' },
        { status: 400 }
      );
    }

    const strength = isStrongEnough(password);
    if (mode === 'register' && strength) {
      return NextResponse.json({ error: strength }, { status: 400 });
    }

    let user = await prisma.user.findUnique({ where: { email } });

    if (mode === 'login') {
      if (!user || !user.passwordHash) {
        return NextResponse.json(
          { error: 'Compte introuvable ou sans mot de passe. Crée un pacte d’abord.' },
          { status: 401 }
        );
      }
      if (!verifyPassword(password, user.passwordHash)) {
        return NextResponse.json(
          { error: 'Mot de passe incorrect' },
          { status: 401 }
        );
      }
      return NextResponse.json({
        ok: true,
        userId: user.id,
        message: 'Connecté',
      });
    }

    // register / set password
    const emailHash = crypto.createHash('sha256').update(email).digest('hex');
    const passwordHash = hashPassword(password);

    if (!user) {
      user = await prisma.user.create({
        data: { email, emailHash, passwordHash },
      });
    } else if (user.passwordHash) {
      // Déjà un mdp → exiger login
      return NextResponse.json(
        {
          error: 'Ce compte a déjà un mot de passe. Utilise « Se connecter ».',
          hasPassword: true,
        },
        { status: 409 }
      );
    } else {
      user = await prisma.user.update({
        where: { id: user.id },
        data: { passwordHash },
      });
    }

    return NextResponse.json({
      ok: true,
      userId: user.id,
      message: 'Mot de passe enregistré',
    });
  } catch (error) {
    console.error('Password POST:', error);
    const msg = error instanceof Error ? error.message : '';
    if (msg.includes('passwordHash') || msg.includes('column')) {
      return NextResponse.json(
        {
          error:
            'Colonne mot de passe absente en base. Exécute dans Supabase SQL : ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "passwordHash" TEXT;',
        },
        { status: 500 }
      );
    }
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
