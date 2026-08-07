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
            <h1 className="mt-5 text-5xl md:text-7xl font-serif leading-tight max-w-[12ch]">
              Pendant quelques jours, quelqu’un tient avec toi.
            </h1>
            <p className="mt-6 text-lg text-[#706b63] dark:text-[#a49f96] max-w-[52ch] leading-relaxed">
              Pas de profil. Pas de chat libre. Juste des gestes et des messages
              de soutien déjà écrits — pour les jours où parler est trop lourd.
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
                <p className="text-sm text-[#1f6b67] mb-1">Tu peux répondre</p>
                <p className="font-medium leading-snug">
                  « Merci. Ça m’aide un peu. »
                </p>
              </div>
              <div className="p-4 rounded-xl bg-[#f2eee5] dark:bg-white/5 border border-black/5 dark:border-white/10">
                <p className="text-sm text-[#a49f96] mb-1">Ou simplement un geste</p>
                <p className="font-medium">Je suis là.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* COMMENT ÇA MARCHE */}
      <section id="comment" className="py-24 border-t border-black/5 dark:border-white/5">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-4xl font-serif max-w-[16ch]">Comment ça marche</h2>
          <p className="mt-3 text-[#706b63] dark:text-[#a49f96] max-w-[48ch]">
            Trois étapes. Aucun spectacle. Une présence réelle.
          </p>
          <div className="mt-12 grid md:grid-cols-3 gap-6">
            {[
              {
                n: '1',
                t: 'Tu choisis une durée',
                d: '1, 3 ou 7 jours. Tu reçois un lien magique par email. Aucun mot de passe.',
              },
              {
                n: '2',
                t: 'Tu es relié à une personne',
                d: 'Quelqu’un d’autre, anonyme, avec la même durée. Pas de profil. Juste un pacte.',
              },
              {
                n: '3',
                t: 'Vous vous tenez',
                d: 'Gestes silencieux et messages de soutien prédéfinis. Tu choisis, tu envoies, l’autre peut répondre.',
              },
            ].map((s) => (
              <article
                key={s.n}
                className="p-6 rounded-2xl border border-black/10 dark:border-white/10 bg-white/50 dark:bg-white/5"
              >
                <span className="inline-flex w-10 h-10 items-center justify-center rounded-full bg-[#1f6b67] text-white font-bold text-sm">
                  {s.n}
                </span>
                <h3 className="mt-4 text-xl font-bold">{s.t}</h3>
                <p className="mt-2 text-sm text-[#706b63] dark:text-[#a49f96] leading-relaxed">
                  {s.d}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CE QUI EST AUTORISÉ */}
      <section className="py-24 bg-[#f2eee5]/40 dark:bg-white/[0.02]">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-4xl font-serif max-w-[14ch]">
            Ce que vous pouvez vous envoyer
          </h2>
          <div className="mt-10 grid md:grid-cols-2 gap-8">
            <div className="p-6 rounded-2xl border border-black/10 dark:border-white/10 bg-white/70 dark:bg-white/5">
              <h3 className="text-lg font-bold text-[#1f6b67]">Gestes silencieux</h3>
              <ul className="mt-4 space-y-2 text-sm text-[#706b63] dark:text-[#a49f96]">
                <li>· Je suis là.</li>
                <li>· Je tiens.</li>
                <li>· Aujourd’hui c’est fragile.</li>
                <li>· Je veille un peu avec toi.</li>
              </ul>
            </div>
            <div className="p-6 rounded-2xl border border-black/10 dark:border-white/10 bg-white/70 dark:bg-white/5">
              <h3 className="text-lg font-bold text-[#1f6b67]">Messages de soutien</h3>
              <p className="mt-4 text-sm text-[#706b63] dark:text-[#a49f96] leading-relaxed">
                Une cinquantaine de phrases déjà écrites — présence, jour
                difficile, fatigue, courage, nuit, espoir. L’autre personne
                reçoit des réponses adaptées à choisir. Pas de texte libre.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* POURQUOI */}
      <section className="py-24">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-4xl font-serif max-w-[14ch]">
            Pourquoi ce site existe
          </h2>
          <p className="mt-5 text-lg text-[#706b63] dark:text-[#a49f96] max-w-[54ch] leading-relaxed">
            Beaucoup de jours sont trop lourds pour parler. Et pourtant, être
            seul avec ça est encore plus lourd. Le Pacte silencieux offre une
            présence minimale, digne, gratuite — sans exiger que tu te racontes.
          </p>
          <p className="mt-4 text-sm text-[#a49f96] max-w-[48ch]">
            Ce n’est pas un substitut à une aide professionnelle. Si tu traverses
            une détresse importante, contacte des ressources adaptées (en France
            : 3114).
          </p>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="py-20 border-t border-black/5 dark:border-white/5">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-serif">
            Tu n’as pas à parler. Quelqu’un peut quand même rester un peu avec
            toi.
          </h2>
          <Link
            href="/start"
            className="mt-8 inline-block px-8 py-4 rounded-full bg-[#1f6b67] text-white font-bold hover:bg-[#184f4d] transition text-lg"
          >
            Commencer un pacte
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}
