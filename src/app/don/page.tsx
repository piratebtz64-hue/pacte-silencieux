'use client';

import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function DonPage() {
  // Un seul lien suffit (PayPal.Me recommandé)
  const link =
    process.env.NEXT_PUBLIC_PAYPAL_DONATION_LINK ||
    process.env.NEXT_PUBLIC_STRIPE_DONATION_LINK ||
    '';

  const isReady = link.startsWith('http');

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

          {isReady ? (
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-10 inline-flex w-full items-center justify-center py-4 rounded-full bg-[#1f6b67] text-white text-lg font-bold hover:bg-[#184f4d] transition"
            >
              Donner via PayPal
            </a>
          ) : (
            <div className="mt-10 p-5 rounded-2xl border border-black/10 dark:border-white/10 bg-[#f2eee5]/60 dark:bg-white/5 text-left">
              <p className="text-sm font-bold mb-2">Activation en 1 minute</p>
              <ol className="text-sm text-[#706b63] dark:text-[#a49f96] space-y-2 list-decimal list-inside leading-relaxed">
                <li>
                  Ouvre{' '}
                  <a
                    className="underline text-[#1f6b67]"
                    href="https://www.paypal.com/paypalme"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    paypal.com/paypalme
                  </a>
                </li>
                <li>Copie ton lien (ex. https://paypal.me/tonnom)</li>
                <li>
                  Vercel → Settings → Environment Variables → ajoute
                  <code className="block mt-1 p-2 rounded bg-black/5 dark:bg-white/10 text-xs break-all">
                    NEXT_PUBLIC_PAYPAL_DONATION_LINK
                  </code>
                  avec ton lien, puis Redeploy
                </li>
              </ol>
            </div>
          )}

          <p className="mt-8 text-xs text-[#a49f96]">
            Paiement sécurisé. Nous ne voyons pas tes données bancaires.
          </p>
        </div>
      </section>

      <Footer />
    </main>
  );
}
