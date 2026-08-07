'use client';

import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BrandBanner from '@/components/BrandBanner';

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <Header />

      {/* BANDEAU MARQUE — pleine largeur */}
      <BrandBanner />

      {/* HERO */}
      <section className="min-h-[70vh] grid place-items-center py-12">
        <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <span className="inline-block px-3 py-1 rounded-full bg-[#1f6b67]/10 text-[#1f6b67] text-xs font-bold uppercase tracking-wide">
              gratuit · anonyme · 1 à 7 jours
            </span>
            <h1 className="mt-5 text-5xl md:text-6xl font-serif leading-tight max-w-[13ch]">
              Pendant quelques jours, quelqu’un tient avec toi.
            </h1>
            <p className="mt-6 text-lg text-[#706b63] dark:text-[#a49f96] max-w-[54ch] leading-relaxed">
              Pas de profil. Pas de chat libre. Des gestes silencieux, des
              messages de soutien déjà écrits — pour les jours où parler est trop
              lourd.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/start"
                className="px-6 py-3 rounded-full bg-[#1f6b67] text-white font-bold hover:bg-[#184f4d] transition"
              >
                Entrer dans un pacte
              </Link>
              <Link
                href="#comment"
                className="px-6 py-3 rounded-full border border-black/10 dark:border-white/10 bg-white/60 dark:bg-white/5"
              >
                Comment ça marche
              </Link>
            </div>
            <p className="mt-6 text-xs text-[#a49f96]">
              100 % gratuit · Aucune publicité · Aucune donnée vendue
            </p>
          </div>

          <div className="p-8 rounded-2xl border border-black/10 dark:border-white/10 bg-white/60 dark:bg-white/5 shadow-lg">
            <div className="text-xs uppercase text-[#a49f96] mb-4 tracking-wide">
              Exemple d’échange
            </div>
            <div className="space-y-3">
              <div className="p-4 rounded-xl bg-[#f2eee5] dark:bg-white/5 border border-black/5 dark:border-white/10">
                <p className="text-sm text-[#a49f96] mb-1">Quelqu’un t’écrit</p>
                <p className="font-medium leading-snug">
                  « Si c’est lourd aujourd’hui, tu n’as pas à le porter seul. »
                </p>
              </div>
              <div className="p-4 rounded-xl bg-[#1f6b67]/8 border border-[#1f6b67]/20 ml-4">
                <p className="text-sm text-[#1f6b67] mb-1">Tu choisis une réponse</p>
                <p className="font-medium leading-snug">
                  « Merci. Ça m’aide un peu. »
                </p>
              </div>
              <div className="p-4 rounded-xl bg-[#f2eee5] dark:bg-white/5 border border-black/5 dark:border-white/10">
                <p className="text-sm text-[#a49f96] mb-1">Ou un geste silencieux</p>
                <p className="font-medium">Je suis là.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="comment" className="py-24 border-t border-black/5 dark:border-white/5">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-4xl font-serif max-w-[18ch]">Comment ça marche</h2>
          <p className="mt-3 text-[#706b63] dark:text-[#a49f96] max-w-[52ch] leading-relaxed">
            Quatre étapes simples. Une présence réelle entre deux personnes qui
            ne se connaissent pas.
          </p>
          <div className="mt-12 grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              {
                n: '1',
                t: 'Tu choisis une durée',
                d: '1, 3 ou 7 jours. Tu peux continuer même si le mail met du temps.',
              },
              {
                n: '2',
                t: 'Tu es relié à quelqu’un',
                d: 'Une autre personne, anonyme, avec la même durée. Pas de profil.',
              },
              {
                n: '3',
                t: 'Vous vous tenez',
                d: 'Gestes silencieux et messages déjà écrits. Réponses parmi des options.',
              },
              {
                n: '4',
                t: 'Vous vous remerciez',
                d: 'En fin de pacte, un message de remerciement. Optionnel et digne.',
              },
            ].map((s) => (
              <article
                key={s.n}
                className="p-6 rounded-2xl border border-black/10 dark:border-white/10 bg-white/50 dark:bg-white/5"
              >
                <span className="inline-flex w-10 h-10 items-center justify-center rounded-full bg-[#1f6b67] text-white font-bold text-sm">
                  {s.n}
                </span>
                <h3 className="mt-4 text-lg font-bold">{s.t}</h3>
                <p className="mt-2 text-sm text-[#706b63] dark:text-[#a49f96] leading-relaxed">
                  {s.d}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-4xl font-serif max-w-[14ch]">Ce que ce n’est pas</h2>
          <div className="mt-10 grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              {
                t: 'Pas un chat',
                d: 'Aucun message libre. Uniquement des phrases choisies.',
              },
              {
                t: 'Pas un réseau social',
                d: 'Pas de profil, pas de likes, pas de followers.',
              },
              {
                t: 'Pas une rencontre',
                d: 'Une seule personne, un temps limité.',
              },
              {
                t: 'Pas un professionnel',
                d: 'Ne remplace ni une assistante sociale, ni un psychologue, ni un médecin.',
              },
            ].map((item) => (
              <article
                key={item.t}
                className="p-6 rounded-2xl border border-black/10 dark:border-white/10 bg-white/50 dark:bg-white/5"
              >
                <h3 className="text-lg font-bold">{item.t}</h3>
                <p className="mt-2 text-sm text-[#706b63] dark:text-[#a49f96] leading-relaxed">
                  {item.d}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section
        id="aide"
        className="py-20 border-t border-black/5 dark:border-white/5 bg-[#1f6b67]/[0.06]"
      >
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-serif">
            Important : ce site n’est pas une aide professionnelle
          </h2>
          <div className="mt-6 space-y-4 text-[#706b63] dark:text-[#a49f96] leading-relaxed">
            <p>
              <strong className="text-inherit">
                Le Pacte silencieux ne remplace pas une assistante sociale
              </strong>
              , un travailleur social, un psychologue ou un médecin.
            </p>
            <p>
              C’est un espace de présence anonyme entre pairs, avec des messages
              déjà écrits. Ce n’est ni un suivi, ni un diagnostic, ni une prise
              en charge.
            </p>
          </div>
          <div className="mt-10 p-6 rounded-2xl border border-[#1f6b67]/25 bg-white/80 dark:bg-white/5">
            <h3 className="text-lg font-bold text-[#1f6b67]">
              En cas de détresse (France)
            </h3>
            <ul className="mt-5 space-y-3 text-sm">
              <li>
                <strong className="text-[#1f6b67]">3114</strong> — Prévention du
                suicide (24h/24)
              </li>
              <li>
                <strong className="text-[#1f6b67]">15</strong> — SAMU
              </li>
              <li>
                <strong className="text-[#1f6b67]">112</strong> — Urgences
              </li>
              <li>
                <strong className="text-[#1f6b67]">119</strong> — Enfance en danger
              </li>
              <li>
                <strong className="text-[#1f6b67]">3919</strong> — Violences faites
                aux femmes
              </li>
              <li>
                <strong className="text-[#1f6b67]">0 800 23 13 13</strong> — Fil
                Santé Jeunes
              </li>
            </ul>
            <p className="mt-5 text-xs text-[#a49f96]">
              En urgence immédiate : 15 ou 112. Ce site n’est pas un service
              d’urgence.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 border-t border-black/5 dark:border-white/5">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-serif leading-snug">
            Tu n’as pas à parler. Quelqu’un peut quand même rester un peu avec
            toi.
          </h2>
          <Link
            href="/start"
            className="mt-8 inline-block px-8 py-4 rounded-full bg-[#1f6b67] text-white font-bold hover:bg-[#184f4d] transition text-lg"
          >
            Commencer un pacte
          </Link>
          <p className="mt-6 text-xs text-[#a49f96]">
            En détresse ?{' '}
            <a href="#aide" className="underline hover:text-[#1f6b67]">
              Voir les numéros d’aide
            </a>
          </p>
        </div>
      </section>

      <Footer />
    </main>
  );
}
