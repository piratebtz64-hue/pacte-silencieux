'use client';

import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const AMOUNTS = [
  { label: '3 €', hint: 'Un café discret', value: '3' },
  { label: '5 €', hint: 'Soutien léger', value: '5' },
  { label: '10 €', hint: 'Présence tangible', value: '10' },
  { label: '20 €', hint: 'Un vrai coup de pouce', value: '20' },
];

export default function DonPage() {
  const stripeLink = process.env.NEXT_PUBLIC_STRIPE_DONATION_LINK;
  const hasStripe = Boolean(stripeLink && stripeLink.startsWith('http'));

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

          {hasStripe ? (
            <div className="mt-10 space-y-3">
              <p className="text-sm font-bold text-[#1f6b67]">
                Choisir un montant indicatif, puis payer via Stripe (sécurisé).
              </p>
              <div className="grid grid-cols-2 gap-3">
                {AMOUNTS.map((a) => (
                  <a
                    key={a.value}
                    href={stripeLink}
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
                href={stripeLink}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 flex w-full items-center justify-center py-3.5 rounded-full bg-[#1f6b67] text-white font-bold hover:bg-[#184f4d] transition"
              >
                Continuer vers le paiement sécurisé
              </a>
              <p className="text-xs text-center text-[#a49f96]">
                Paiement traité par Stripe. Nous ne voyons pas ton numéro de carte.
              </p>
            </div>
          ) : (
            <div className="mt-10 p-6 rounded-2xl border border-amber-200 dark:border-amber-800/40 bg-amber-50 dark:bg-amber-900/20">
              <p className="text-sm text-amber-900 dark:text-amber-200 leading-relaxed">
                Le lien de paiement n’est pas encore configuré. Dès qu’un{' '}
                <strong>Stripe Payment Link</strong> est ajouté dans les variables
                d’environnement Vercel (<code className="text-xs">NEXT_PUBLIC_STRIPE_DONATION_LINK</code>),
                ce bouton s’activera automatiquement.
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
