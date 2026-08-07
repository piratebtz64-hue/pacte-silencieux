'use client';

import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { DONATION_LINK } from '@/lib/donation';

export default function DonPage() {
  return (
    <main className="min-h-screen flex flex-col">
      <Header />

      <section className="flex-1 grid place-items-center py-16 px-4">
        <div className="max-w-md w-full text-center">
          <Link
            href="/"
            className="text-sm text-[#706b63] dark:text-[#a49f96] hover:underline"
          >
            ← Retour
          </Link>

          <h1 className="mt-8 text-3xl md:text-4xl font-serif">Faire un don</h1>

          <p className="mt-4 text-[#706b63] dark:text-[#a49f96] leading-relaxed">
            Le site est gratuit. Un don aide uniquement à le faire vivre
            (hébergement, emails). Aucune obligation.
          </p>

          <a
            href={DONATION_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-10 inline-flex w-full items-center justify-center py-4 rounded-full bg-[#1f6b67] text-white text-lg font-bold hover:bg-[#184f4d] transition"
          >
            Donner via Stripe
          </a>

          <p className="mt-8 text-xs text-[#a49f96]">
            Paiement sécurisé par Stripe. Nous ne voyons pas tes données bancaires.
          </p>
        </div>
      </section>

      <Footer />
    </main>
  );
}
