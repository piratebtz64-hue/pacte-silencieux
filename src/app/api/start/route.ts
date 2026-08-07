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
    const body = await request.json();
    const { email, durationDays, forceNew } = body;

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

    const now = new Date();

    // Reprendre un pacte ACTIF existant (historique conservé)
    if (!forceNew) {
      const active = await prisma.pact.findFirst({
        where: {
          status: 'ACTIVE',
          endsAt: { gt: now },
          userAId: { not: null },
          userBId: { not: null },
          OR: [{ userAId: user.id }, { userBId: user.id }],
        },
        orderBy: { startedAt: 'desc' },
      });

      if (
        active &&
        active.userAId &&
        active.userBId &&
        active.userAId !== active.userBId
      ) {
        return NextResponse.json({
          message: 'Pacte actif repris — historique conservé',
          userId: user.id,
          pactId: active.id,
          resume: true,
          emailSent: false,
          continueUrl: `${APP_URL}/pact/${active.id}`,
        });
      }
    }

    // Fermer seulement les WAITING (pas les ACTIVE encore valides si forceNew)
    await prisma.pact.updateMany({
      where: {
        status: 'WAITING',
        OR: [{ userAId: user.id }, { userBId: user.id }],
      },
      data: { status: 'ENDED' },
    });

    if (forceNew) {
      await prisma.pact.updateMany({
        where: {
          status: 'ACTIVE',
          OR: [{ userAId: user.id }, { userBId: user.id }],
        },
        data: { status: 'ENDED' },
      });
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { activePactId: null, waitingSince: new Date() },
    });

    const pact = await prisma.pact.create({
      data: {
        durationDays,
        userAId: user.id,
        status: 'WAITING',
      },
    });

    let emailSent = false;
    let emailWarning: string | null = null;

    try {
      const supabase = await createServerSupabaseClient();
      const { error: authError } = await supabase.auth.signInWithOtp({
        email: normalizedEmail,
        options: {
          emailRedirectTo: `${APP_URL}/auth/callback`,
          shouldCreateUser: true,
          data: { pactId: pact.id, durationDays },
        },
      });

      if (authError) {
        console.error('Supabase auth error (non bloquant):', authError);
        emailWarning =
          authError.message?.includes('rate') ||
          authError.message?.includes('limit')
            ? 'Limite d’emails atteinte. Tu peux continuer sans le mail.'
            : 'Email non envoyé. Tu peux continuer sans le mail.';
      } else {
        emailSent = true;
      }
    } catch (e) {
      console.error('OTP exception (non bloquant):', e);
      emailWarning = 'Email non envoyé. Tu peux continuer sans le mail.';
    }

    return NextResponse.json(
      {
        message: emailSent
          ? 'Lien magique envoyé'
          : 'Pacte créé — continue sans attendre le mail',
        userId: user.id,
        pactId: pact.id,
        resume: false,
        emailSent,
        emailWarning,
        continueUrl: `${APP_URL}/waiting`,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
