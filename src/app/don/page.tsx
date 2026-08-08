'use client';

import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import StripeBuyButton from '@/components/StripeBuyButton';
import { STRIPE_PAYMENT_LINK } from '@/lib/donation';

export default function DonPage() {
  return (
    <main className="min-h-screen flex flex-col">
      <Header />

      <section className="flex-1 grid place-items-center py-14 px-4">
        <div className="max-w-md w-full text-center">
          <Link
            href="/"
            className="text-sm hover:underline"
            style={{ color: 'var(--muted)' }}
          >
            ← Retour
          </Link>

          <h1 className="mt-8 text-3xl md:text-4xl font-serif tracking-tight">
            Faire un don
          </h1>

          <p
            className="mt-4 leading-relaxed text-sm sm:text-base"
            style={{ color: 'var(--muted)' }}
          >
            Le Pacte silencieux est <strong style={{ color: 'var(--foreground)' }}>gratuit</strong>.
            Un don volontaire aide uniquement à couvrir l’hébergement et les
            e-mails. Aucune obligation, aucun abonnement.
          </p>

          <div className="card-premium mt-10 p-6 md:p-8">
            <StripeBuyButton />
          </div>

          <p className="mt-6 text-xs leading-relaxed" style={{ color: 'var(--muted)' }}>
            Paiement sécurisé par{' '}
            <a
              href={STRIPE_PAYMENT_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2"
            >
              Stripe
            </a>
            . Nous ne voyons pas tes données bancaires.
          </p>

          <Link
            href="/start"
            className="mt-10 inline-block text-sm font-semibold hover:underline"
            style={{ color: 'var(--accent)' }}
          >
            Continuer vers un pacte →
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}
