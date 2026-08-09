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
    if (!process.env.DATABASE_URL) {
      return NextResponse.json(
        {
          error:
            'Configuration manquante : DATABASE_URL. Vérifie les variables d’environnement Vercel.',
        },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { email, durationDays, forceNew } = body;

    if (!email || !durationDays) {
      return NextResponse.json(
        { error: 'Email et durée requis' },
        { status: 400 }
      );
    }

    const days = Number(durationDays);
    if (![1, 3, 7].includes(days)) {
      return NextResponse.json(
        { error: 'Durée invalide. Choisir: 1, 3 ou 7 jours' },
        { status: 400 }
      );
    }

    const normalizedEmail = String(email).toLowerCase().trim();
    const emailHash = crypto
      .createHash('sha256')
      .update(normalizedEmail)
      .digest('hex');

    let user;
    try {
      user = await prisma.user.findUnique({
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
    } catch (dbErr) {
      console.error('Prisma user error:', dbErr);
      const msg = dbErr instanceof Error ? dbErr.message : String(dbErr);
      return NextResponse.json(
        {
          error: 'Base de données inaccessible.',
          detail: msg.slice(0, 200),
        },
        { status: 500 }
      );
    }

    const now = new Date();

    if (!forceNew) {
      try {
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

        // Vrai pacte à deux personnes distinctes uniquement
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
            status: 'ACTIVE',
            emailSent: false,
            continueUrl: `${APP_URL}/pact/${active.id}`,
          });
        }

        // ACTIVE fantôme → on le clôture
        if (active) {
          await prisma.pact
            .update({
              where: { id: active.id },
              data: { status: 'ENDED' },
            })
            .catch(() => {});
        }

        const waiting = await prisma.pact.findFirst({
          where: {
            status: 'WAITING',
            userBId: null,
            OR: [{ userAId: user.id }],
          },
          orderBy: { createdAt: 'desc' },
        });

        if (waiting) {
          return NextResponse.json({
            message: 'Pacte en attente repris',
            userId: user.id,
            pactId: waiting.id,
            resume: true,
            status: 'WAITING',
            emailSent: false,
            continueUrl: `${APP_URL}/waiting`,
          });
        }
      } catch (e) {
        console.error('Active/waiting pact lookup:', e);
      }
    }

    try {
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
    } catch (e) {
      console.error('Pact cleanup:', e);
    }

    let pact;
    try {
      pact = await prisma.pact.create({
        data: {
          durationDays: days,
          userAId: user.id,
          status: 'WAITING',
        },
      });
    } catch (dbErr) {
      console.error('Pact create:', dbErr);
      const msg = dbErr instanceof Error ? dbErr.message : String(dbErr);
      return NextResponse.json(
        {
          error: 'Impossible de créer le pacte.',
          detail: msg.slice(0, 200),
        },
        { status: 500 }
      );
    }

    let emailSent = false;
    let emailWarning: string | null = null;

    try {
      const supabase = await createServerSupabaseClient();
      const { error: authError } = await supabase.auth.signInWithOtp({
        email: normalizedEmail,
        options: {
          emailRedirectTo: `${APP_URL}/auth/callback`,
          shouldCreateUser: true,
          data: { pactId: pact.id, durationDays: days },
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
        status: 'WAITING',
        emailSent,
        emailWarning,
        continueUrl: `${APP_URL}/waiting`,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('API error:', error);
    const msg = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { error: 'Erreur serveur', detail: msg.slice(0, 200) },
      { status: 500 }
    );
  }
}
