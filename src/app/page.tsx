'use client';

import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <Header />

      {/* HERO */}
      <section className="min-h-[88vh] grid place-items-center py-16">
        <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <span className="inline-block px-3 py-1 rounded-full bg-[#1f6b67]/10 text-[#1f6b67] text-xs font-bold uppercase tracking-wide">
              gratuit · anonyme · 1 à 7 jours
            </span>
            <h1 className="mt-5 text-5xl md:text-7xl font-serif leading-tight max-w-[13ch]">
              Pendant quelques jours, quelqu’un tient avec toi.
            </h1>
            <p className="mt-6 text-lg text-[#706b63] dark:text-[#a49f96] max-w-[54ch] leading-relaxed">
              Pas de profil. Pas de chat libre. Des gestes silencieux, des
              messages de soutien déjà écrits, et des remerciements en fin de
              pacte — pour les jours où parler est trop lourd.
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
              <div className="p-4 rounded-xl bg-[#1f6b67]/8 border border-[#1f6b67]/20 ml-4">
                <p className="text-sm text-[#1f6b67] mb-1">En fin de pacte</p>
                <p className="font-medium leading-snug">
                  « Merci d’avoir tenu avec moi. »
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* COMMENT ÇA MARCHE */}
      <section id="comment" className="py-24 border-t border-black/5 dark:border-white/5">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-4xl font-serif max-w-[18ch]">Comment ça marche</h2>
          <p className="mt-3 text-[#706b63] dark:text-[#a49f96] max-w-[52ch] leading-relaxed">
            Quatre étapes simples. Aucun spectacle. Une présence réelle entre
            deux personnes qui ne se connaissent pas.
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
                d: 'Une autre personne, anonyme, avec la même durée. Pas de profil, pas de photo, pas de nom.',
              },
              {
                n: '3',
                t: 'Vous vous tenez',
                d: 'Gestes silencieux et messages de soutien déjà écrits. L’autre répond parmi des options adaptées.',
              },
              {
                n: '4',
                t: 'Vous vous remerciez',
                d: 'En fin de pacte, chacun peut envoyer un message de remerciement. Optionnel, simple, digne.',
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

      {/* CE QUE VOUS POUVEZ FAIRE */}
      <section className="py-24 bg-[#f2eee5]/40 dark:bg-white/[0.02]">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-4xl font-serif max-w-[16ch]">
            Ce que vous pouvez vous envoyer
          </h2>
          <p className="mt-3 text-[#706b63] dark:text-[#a49f96] max-w-[50ch]">
            Tout est prédéfini. Aucun texte libre. C’est ce qui protège le cadre
            et rend l’échange possible même quand on n’a plus les mots.
          </p>

          <div className="mt-10 grid md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl border border-black/10 dark:border-white/10 bg-white/70 dark:bg-white/5">
              <h3 className="text-lg font-bold text-[#1f6b67]">Gestes silencieux</h3>
              <p className="mt-2 text-sm text-[#706b63] dark:text-[#a49f96]">
                Un signe simple, sans explication.
              </p>
              <ul className="mt-4 space-y-2 text-sm text-[#706b63] dark:text-[#a49f96]">
                <li>· Je suis là.</li>
                <li>· Je tiens.</li>
                <li>· Aujourd’hui c’est fragile.</li>
                <li>· Je veille un peu avec toi.</li>
              </ul>
            </div>

            <div className="p-6 rounded-2xl border border-black/10 dark:border-white/10 bg-white/70 dark:bg-white/5">
              <h3 className="text-lg font-bold text-[#1f6b67]">Messages de soutien</h3>
              <p className="mt-2 text-sm text-[#706b63] dark:text-[#a49f96] leading-relaxed">
                Des phrases déjà écrites : présence, jour difficile, fatigue,
                motivation, anxiété, nuit… L’autre répond parmi des options
                adaptées.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-black/10 dark:border-white/10 bg-white/70 dark:bg-white/5">
              <h3 className="text-lg font-bold text-[#1f6b67]">Remerciements</h3>
              <p className="mt-2 text-sm text-[#706b63] dark:text-[#a49f96] leading-relaxed">
                En fin de pacte, des messages pour dire merci. Optionnel, simple,
                digne.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CE QUE CE N’EST PAS */}
      <section className="py-24">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-4xl font-serif max-w-[14ch]">Ce que ce n’est pas</h2>
          <div className="mt-10 grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              {
                t: 'Pas un chat',
                d: 'Aucun message libre. Uniquement des phrases choisies à l’avance.',
              },
              {
                t: 'Pas un réseau social',
                d: 'Pas de profil, pas de fil, pas de likes, pas de followers.',
              },
              {
                t: 'Pas une rencontre',
                d: 'Une seule personne, un temps limité, puis chacun reprend sa route.',
              },
              {
                t: 'Pas un professionnel',
                d: 'Ce site ne remplace ni une assistante sociale, ni un psychologue, ni un médecin.',
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

      {/* CADRE & AIDE — TRÈS IMPORTANT */}
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
              , un travailleur social, un psychologue, un psychiatre ou tout
              autre professionnel de l’accompagnement ou du soin.
            </p>
            <p>
              C’est un espace de{' '}
              <strong className="text-inherit">présence anonyme entre pairs</strong>
              , avec des messages déjà écrits. Ce n’est{' '}
              <strong className="text-inherit">ni un suivi</strong>,{' '}
              <strong className="text-inherit">ni un diagnostic</strong>,{' '}
              <strong className="text-inherit">ni une prise en charge</strong>.
            </p>
            <p>
              Si tu es en difficulté sociale, administrative, familiale ou de
              santé, adresse-toi de préférence à un professionnel ou à une
              structure de proximité (CCAS, association, médecin, etc.).
            </p>
          </div>

          <div className="mt-10 p-6 rounded-2xl border border-[#1f6b67]/25 bg-white/80 dark:bg-white/5">
            <h3 className="text-lg font-bold text-[#1f6b67]">
              En cas de détresse (France)
            </h3>
            <p className="mt-2 text-sm text-[#706b63] dark:text-[#a49f96]">
              Ces numéros sont gratuits, anonymes, 24h/24 quand indiqué.
            </p>
            <ul className="mt-5 space-y-3 text-sm">
              <li className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-3">
                <span className="font-bold text-[#1f6b67] shrink-0 tabular-nums">
                  3114
                </span>
                <span className="text-[#706b63] dark:text-[#a49f96]">
                  Numéro national de prévention du suicide — 24h/24, 7j/7
                </span>
              </li>
              <li className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-3">
                <span className="font-bold text-[#1f6b67] shrink-0 tabular-nums">
                  15
                </span>
                <span className="text-[#706b63] dark:text-[#a49f96]">
                  SAMU — urgence médicale
                </span>
              </li>
              <li className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-3">
                <span className="font-bold text-[#1f6b67] shrink-0 tabular-nums">
                  112
                </span>
                <span className="text-[#706b63] dark:text-[#a49f96]">
                  Urgences (numéro européen)
                </span>
              </li>
              <li className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-3">
                <span className="font-bold text-[#1f6b67] shrink-0 tabular-nums">
                  119
                </span>
                <span className="text-[#706b63] dark:text-[#a49f96]">
                  Enfance en danger
                </span>
              </li>
              <li className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-3">
                <span className="font-bold text-[#1f6b67] shrink-0 tabular-nums">
                  3919
                </span>
                <span className="text-[#706b63] dark:text-[#a49f96]">
                  Violences faites aux femmes (écoute, info, orientation)
                </span>
              </li>
              <li className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-3">
                <span className="font-bold text-[#1f6b67] shrink-0">
                  0 800 23 13 13
                </span>
                <span className="text-[#706b63] dark:text-[#a49f96]">
                  Fil Santé Jeunes — jusqu’à 25 ans
                </span>
              </li>
            </ul>
            <p className="mt-5 text-xs text-[#a49f96] leading-relaxed">
              En situation d’urgence immédiate, appelle le 15 ou le 112. Le
              Pacte silencieux n’est pas un service d’urgence.
            </p>
          </div>
        </div>
      </section>

      {/* POURQUOI */}
      <section className="py-24 border-t border-black/5 dark:border-white/5">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-4xl font-serif max-w-[14ch]">
            Pourquoi ce site existe
          </h2>
          <p className="mt-5 text-lg text-[#706b63] dark:text-[#a49f96] max-w-[56ch] leading-relaxed">
            Beaucoup de jours sont trop lourds pour parler. Et pourtant, être
            seul avec ça est encore plus lourd. Le Pacte silencieux offre une
            présence minimale, digne, gratuite — sans exiger que tu te racontes.
          </p>
          <p className="mt-4 text-lg text-[#706b63] dark:text-[#a49f96] max-w-[56ch] leading-relaxed">
            Tu n’as pas à performer. Tu n’as pas à expliquer. Tu choisis un
            geste ou une phrase, et quelqu’un de l’autre côté peut te répondre
            dans le même langage.
          </p>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="py-20 border-t border-black/5 dark:border-white/5">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-serif leading-snug">
            Tu n’as pas à parler. Quelqu’un peut quand même rester un peu avec
            toi.
          </h2>
          <p className="mt-4 text-[#706b63] dark:text-[#a49f96]">
            Gratuit. Anonyme. Sans chat libre. Sans remplacer un professionnel.
          </p>
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
