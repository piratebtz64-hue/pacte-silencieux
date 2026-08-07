import { createServerSupabaseClient } from '@/lib/supabase';
import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

const APP_URL =
  process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, '') ||
  'https://pacte-silencieux.vercel.app';

export async function POST(request: NextRequest) {
  try {
    const { email, durationDays } = await request.json();

    if (!email || !durationDays) {
      return NextResponse.json(
        { error: 'Email et durée requis' },
        { status: 400 }
      );
    }

    if (![1, 3, 7].includes(durationDays)) {
      return NextResponse.json(
        { error: 'Durée invalide. Choisir: 1, 3 ou 7 jours' },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();
    const emailHash = crypto
      .createHash('sha256')
      .update(normalizedEmail)
      .digest('hex');

    let user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email: normalizedEmail,
          emailHash,
        },
      });
    }

    const pact = await prisma.pact.create({
      data: {
        durationDays,
        userAId: user.id,
        status: 'WAITING',
      },
    });

    const supabase = await createServerSupabaseClient();

    // URL EXACTE sans query — doit matcher la whitelist Supabase
    const redirectTo = `${APP_URL}/auth/callback`;

    const { error: authError } = await supabase.auth.signInWithOtp({
      email: normalizedEmail,
      options: {
        emailRedirectTo: redirectTo,
        shouldCreateUser: true,
        data: {
          pactId: pact.id,
          durationDays,
        },
      },
    });

    if (authError) {
      console.error('Supabase auth error:', authError);
      return NextResponse.json(
        { error: authError.message || "Erreur lors de l'envoi du lien" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        message: 'Lien magique envoyé',
        userId: user.id,
        pactId: pact.id,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
