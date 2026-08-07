import { createServerSupabaseClient } from '@/lib/supabase';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';
import { NextRequest, NextResponse } from 'next/server';


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

    const emailHash = crypto
      .createHash('sha256')
      .update(email.toLowerCase().trim())
      .digest('hex');

    // Vérifier si l'utilisateur existe déjà
    let user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    // Créer l'utilisateur s'il n'existe pas
    if (!user) {
      user = await prisma.user.create({
        data: {
          email: email.toLowerCase().trim(),
          emailHash,
        },
      });
    }

    // Créer un nouveau pact en attente
    const pact = await prisma.pact.create({
      data: {
        durationDays,
        userAId: user.id,
        status: 'WAITING',
      },
    });

    // Envoyer le lien magique via Supabase Auth
    const supabase = await createServerSupabaseClient();
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    const { error: authError } = await supabase.auth.signInWithOtp({
      email: email.toLowerCase().trim(),
      options: {
        emailRedirectTo: `${baseUrl}/auth/callback?pactId=${pact.id}`,
      },
    });

    if (authError) {
      console.error('Supabase auth error:', authError);
      return NextResponse.json(
        { error: 'Erreur lors de l\'envoi du lien' },
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
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}
