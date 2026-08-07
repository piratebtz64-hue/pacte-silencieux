'use client';

import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const AMOUNTS = [
  { label: '3 €', hint: 'Un café discret' },
  { label: '5 €', hint: 'Soutien léger' },
  { label: '10 €', hint: 'Présence tangible' },
  { label: '20 €', hint: 'Un vrai coup de pouce' },
];

export default function DonPage() {
  const paypal = process.env.NEXT_PUBLIC_PAYPAL_DONATION_LINK;
  const stripe = process.env.NEXT_PUBLIC_STRIPE_DONATION_LINK;
  const paymentLink =
    paypal && paypal.startsWith('http')
      ? paypal
      : stripe && stripe.startsWith('http')
        ? stripe
        : null;
  const provider = paypal && paypal.startsWith('http') ? 'PayPal' : paymentLink ? 'Stripe' : null;

  return (
    <main className="min-h-screen flex flex-col">
      <Header />

      <section className="flex-1 py-16">
        <div className="max-w-lg mx-auto px-4">
          <Link
            href="/"
            className="text-sm text-[#706b63] dark:text-[#a49f96] hover:underline"
          >
            ← Retour
          </Link>

          <h1 className="mt-6 text-3xl md:text-4xl font-serif">Faire un don</h1>
          <p className="mt-4 text-[#706b63] dark:text-[#a49f96] leading-relaxed">
            Le Pacte silencieux est <strong>100 % gratuit</strong> pour celles et
            ceux qui en ont besoin. Aucune publicité, aucune vente de données.
          </p>
          <p className="mt-3 text-[#706b63] dark:text-[#a49f96] leading-relaxed">
            Si tu souhaites aider à faire vivre le site (hébergement, emails,
            maintenance), un don libre est le bienvenu. Aucune obligation.
          </p>

          {paymentLink ? (
            <div className="mt-10 space-y-3">
              <p className="text-sm font-bold text-[#1f6b67]">
                Paiement sécurisé via {provider}. Montant libre de ton côté.
              </p>
              <div className="grid grid-cols-2 gap-3">
                {AMOUNTS.map((a) => (
                  <a
                    key={a.label}
                    href={paymentLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-4 rounded-xl border border-black/10 dark:border-white/10 hover:border-[#1f6b67] hover:bg-[#1f6b67]/5 transition text-center"
                  >
                    <span className="block text-xl font-bold">{a.label}</span>
                    <span className="block text-xs text-[#a49f96] mt-1">{a.hint}</span>
                  </a>
                ))}
              </div>
              <a
                href={paymentLink}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 flex w-full items-center justify-center py-3.5 rounded-full bg-[#1f6b67] text-white font-bold hover:bg-[#184f4d] transition"
              >
                Continuer vers {provider}
              </a>
              <p className="text-xs text-center text-[#a49f96]">
                Tu seras redirigé vers {provider}. Nous ne voyons pas tes données
                bancaires.
              </p>
            </div>
          ) : (
            <div className="mt-10 p-6 rounded-2xl border border-amber-200 dark:border-amber-800/40 bg-amber-50 dark:bg-amber-900/20">
              <p className="text-sm text-amber-900 dark:text-amber-200 leading-relaxed font-bold mb-2">
                Lien PayPal à configurer
              </p>
              <p className="text-sm text-amber-900 dark:text-amber-200 leading-relaxed">
                1. Crée un lien de don sur{' '}
                <a
                  href="https://www.paypal.com/buttons/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline"
                >
                  PayPal Buttons
                </a>{' '}
                (ou PayPal.Me)
                <br />
                2. Sur Vercel → Settings → Environment Variables, ajoute :
                <br />
                <code className="text-xs block mt-2 p-2 rounded bg-black/5 dark:bg-white/10">
                  NEXT_PUBLIC_PAYPAL_DONATION_LINK = https://paypal.me/toncompte
                </code>
                3. Redeploy. Le bouton s’activera tout seul.
              </p>
            </div>
          )}

          <p className="mt-12 text-xs text-center text-[#a49f96] leading-relaxed">
            Merci. Chaque geste compte, y compris celui de simplement utiliser le
            site.
          </p>
        </div>
      </section>

      <Footer />
    </main>
  );
}
