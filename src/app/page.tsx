'use client';

import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <Header />

      <section className="min-h-[90vh] grid place-items-center py-16">
        <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <span className="inline-block px-3 py-1 rounded-full bg-[#1f6b67]/10 text-[#1f6b67] text-xs font-bold uppercase tracking-wide">
              présence discrète • 1 à 7 jours
            </span>
            <h1 className="mt-5 text-5xl md:text-7xl font-serif leading-tight max-w-[11ch]">
              Pendant quelques jours, quelqu’un tient avec toi, en silence.
            </h1>
            <p className="mt-6 text-lg text-[#706b63] dark:text-[#a49f96] max-w-[58ch]">
              Une présence douce entre deux inconnus, sans conversation, sans
              profil, sans bruit.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/start"
                className="px-6 py-3 rounded-full bg-[#1f6b67] text-white font-bold hover:bg-[#184f4d] transition"
              >
                Créer le premier pacte
              </Link>
              <Link
                href="#concept"
                className="px-6 py-3 rounded-full border border-black/10 dark:border-white/10 bg-white/60 dark:bg-white/5"
              >
                Voir le concept
              </Link>
            </div>
          </div>

          <div className="p-8 rounded-2xl border border-black/10 dark:border-white/10 bg-white/60 dark:bg-white/5 shadow-lg">
            <div className="text-xs uppercase text-[#a49f96] mb-4 tracking-wide">
              Aperçu d’un pacte
            </div>
            <div className="space-y-3">
              <div className="p-4 rounded-lg bg-[#f2eee5] dark:bg-white/5 border border-black/10 dark:border-white/10 flex justify-between items-center">
                <div>
                  <strong>Je suis là.</strong>
                  <span className="block text-sm text-[#706b63] dark:text-[#a49f96]">
                    Un geste de présence.
                  </span>
                </div>
                <span className="px-2 py-1 rounded-full bg-[#1f6b67]/10 text-[#1f6b67] text-xs font-bold">
                  jour 1
                </span>
              </div>
              <div className="p-4 rounded-lg bg-[#f2eee5] dark:bg-white/5 border border-black/10 dark:border-white/10 flex justify-between items-center">
                <div>
                  <strong>Aujourd’hui c’est fragile.</strong>
                  <span className="block text-sm text-[#706b63] dark:text-[#a49f96]">
                    Sans explication.
                  </span>
                </div>
                <span className="px-2 py-1 rounded-full bg-[#1f6b67]/10 text-[#1f6b67] text-xs font-bold">
                  jour 2
                </span>
              </div>
              <div className="p-4 rounded-lg bg-[#f2eee5] dark:bg-white/5 border border-black/10 dark:border-white/10 flex justify-between items-center">
                <div>
                  <strong>Je veille un peu avec toi.</strong>
                  <span className="block text-sm text-[#706b63] dark:text-[#a49f96]">
                    Un signe tendre.
                  </span>
                </div>
                <span className="px-2 py-1 rounded-full bg-[#1f6b67]/10 text-[#1f6b67] text-xs font-bold">
                  jour 3
                </span>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3 mt-5">
              <div className="p-3 rounded-lg bg-[#f2eee5]/60 dark:bg-white/5 border border-black/10 dark:border-white/10 text-center">
                <strong>1</strong>
                <span className="block text-xs text-[#706b63] dark:text-[#a49f96]">
                  seule personne
                </span>
              </div>
              <div className="p-3 rounded-lg bg-[#f2eee5]/60 dark:bg-white/5 border border-black/10 dark:border-white/10 text-center">
                <strong>0</strong>
                <span className="block text-xs text-[#706b63] dark:text-[#a49f96]">
                  profil, chat
                </span>
              </div>
              <div className="p-3 rounded-lg bg-[#f2eee5]/60 dark:bg-white/5 border border-black/10 dark:border-white/10 text-center">
                <strong>3</strong>
                <span className="block text-xs text-[#706b63] dark:text-[#a49f96]">
                  durées
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="concept" className="py-24">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-4xl font-serif max-w-[12ch]">
            Un produit qui ne demande pas de se raconter
          </h2>
          <p className="mt-4 text-[#706b63] dark:text-[#a49f96] max-w-[46ch]">
            Beaucoup d’expériences numériques exigent de parler, publier,
            performer. Ici, presque rien n’est permis — et c’est cette retenue
            qui crée la valeur.
          </p>
          <div className="mt-10 grid md:grid-cols-3 gap-4">
            <article className="p-6 rounded-xl border border-black/10 dark:border-white/10 bg-white/60 dark:bg-white/5">
              <h3 className="text-xl font-bold">Pas de spectacle social</h3>
              <p className="mt-2 text-sm text-[#706b63] dark:text-[#a49f96]">
                Aucun fil, aucun like, aucun compteur.
              </p>
            </article>
            <article className="p-6 rounded-xl border border-black/10 dark:border-white/10 bg-white/60 dark:bg-white/5">
              <h3 className="text-xl font-bold">Une relation à deux</h3>
              <p className="mt-2 text-sm text-[#706b63] dark:text-[#a49f96]">
                Une seule personne. Aucun profil.
              </p>
            </article>
            <article className="p-6 rounded-xl border border-black/10 dark:border-white/10 bg-white/60 dark:bg-white/5">
              <h3 className="text-xl font-bold">Des gestes au lieu d’un chat</h3>
              <p className="mt-2 text-sm text-[#706b63] dark:text-[#a49f96]">
                Quelques signes rares, pas de conversation.
              </p>
            </article>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
