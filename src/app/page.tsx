'use client';

import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BrandBanner from '@/components/BrandBanner';
import Reveal from '@/components/Reveal';

const HELPLINES: [string, string][] = [
  ['3114', 'Prévention du suicide (24h/24, gratuit)'],
  ['15', 'SAMU — urgence médicale'],
  ['112', 'Urgences (Europe)'],
  ['18', 'Pompiers'],
  ['17', 'Police / gendarmerie'],
  ['119', 'Enfance en danger (24h/24)'],
  ['3919', 'Violences faites aux femmes (24h/24)'],
  ['3977', 'Maltraitance personnes âgées / handicap'],
  ['0 800 23 13 13', 'Fil Santé Jeunes'],
  ['0 800 858 858', 'Croix-Rouge Écoute'],
  ['09 72 39 40 50', 'SOS Amitié (écoute)'],
  ['0 800 200 000', 'Drogues Info Service'],
  ['0 800 39 40 50', 'Alcool Info Service'],
  ['114', 'Urgence sourds et malentendants — SMS, fax ou appli (pas d’appel vocal)'],
];

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col">
      <Header />
      <BrandBanner />

      <section className="relative py-12 md:py-20">
        <div className="max-w-6xl mx-auto px-4 grid lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          <div className="lg:col-span-7 animate-fade-up">
            <span className="badge">gratuit · anonyme · 1 à 7 jours</span>
            <h1 className="mt-5 font-serif text-[2.1rem] sm:text-4xl lg:text-[2.85rem] leading-[1.15] tracking-tight max-w-[22ch]">
              Quand tu n’as pas envie de parler à quelqu’un de réel, ou que
              personne n’est disponible.
            </h1>
            <p
              className="mt-5 text-base sm:text-lg leading-relaxed max-w-[42ch]"
              style={{ color: 'var(--muted)' }}
            >
              Une <strong style={{ color: 'var(--foreground)' }}>présence anonyme entre pairs</strong>
              {' '}— gestes et messages déjà écrits, sans chat libre, sans profil.
              Ce n’est <strong style={{ color: 'var(--foreground)' }}>pas</strong> une
              assistante sociale, ni un psy, ni un service d’urgence.
            </p>
            <div className="mt-8 flex flex-wrap gap-3 items-center">
              <Link href="/start" className="btn-primary">
                Commencer un pacte
              </Link>
              <a href="#comment" className="btn-ghost">
                Comment ça marche
              </a>
            </div>
            <p className="mt-3 text-xs" style={{ color: 'var(--muted)' }}>
              Environ 2 minutes · même email = reconnexion possible
            </p>
          </div>

          <div className="lg:col-span-5 animate-fade-up animate-delay-2">
            <div className="card-premium p-6 md:p-7">
              <p
                className="text-[10px] uppercase tracking-[0.16em] font-bold mb-4"
                style={{ color: 'var(--muted)' }}
              >
                Exemple
              </p>
              <div className="space-y-3">
                <div
                  className="p-3.5 rounded-2xl border"
                  style={{
                    borderColor: 'var(--border)',
                    background: 'var(--card-solid)',
                  }}
                >
                  <p className="text-[11px] mb-1" style={{ color: 'var(--muted)' }}>
                    Quelqu’un t’écrit
                  </p>
                  <p className="text-sm leading-snug font-medium">
                    « Si c’est lourd aujourd’hui, tu n’as pas à le porter seul. »
                  </p>
                </div>
                <div
                  className="p-3.5 rounded-2xl ml-2 border"
                  style={{
                    borderColor:
                      'color-mix(in srgb, var(--accent) 25%, transparent)',
                    background: 'var(--accent-soft)',
                  }}
                >
                  <p
                    className="text-[11px] mb-1 font-medium"
                    style={{ color: 'var(--accent)' }}
                  >
                    Tu choisis une réponse
                  </p>
                  <p className="text-sm leading-snug font-medium">
                    « Merci. Ça m’aide un peu. »
                  </p>
                </div>
                <div
                  className="p-3.5 rounded-2xl border"
                  style={{
                    borderColor: 'var(--border)',
                    background: 'var(--card-solid)',
                  }}
                >
                  <p className="text-[11px] mb-1" style={{ color: 'var(--muted)' }}>
                    Ou un geste
                  </p>
                  <p className="text-sm font-medium">Je suis là.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="pb-14 md:pb-16">
        <div className="max-w-6xl mx-auto px-4 grid sm:grid-cols-3 gap-4">
          {[
            {
              t: 'Cadre sûr',
              d: 'Pas de message libre : uniquement des phrases et gestes choisis. Pas de profil public.',
            },
            {
              t: 'Temps limité',
              d: '1, 3 ou 7 jours. À la fin, les deux peuvent prolonger d’une semaine — ou s’arrêter.',
            },
            {
              t: 'Complément',
              d: 'Utile le soir ou entre deux RDV. Dès que ça dépasse : les numéros en bas de page.',
            },
          ].map((item, i) => (
            <Reveal key={item.t} delay={i * 40}>
              <article className="card-premium p-5 h-full">
                <h2 className="text-base font-semibold tracking-tight">{item.t}</h2>
                <p className="mt-1.5 text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>
                  {item.d}
                </p>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      <section id="comment" className="py-14 md:py-18 border-t" style={{ borderColor: 'var(--border)' }}>
        <div className="max-w-6xl mx-auto px-4">
          <Reveal>
            <h2 className="font-serif text-2xl md:text-3xl tracking-tight">
              Comment ça marche
            </h2>
          </Reveal>
          <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { n: '1', t: 'Durée', d: 'Tu choisis 1, 3 ou 7 jours.' },
              { n: '2', t: 'Match', d: 'Une autre personne anonyme, même durée.' },
              { n: '3', t: 'Présence', d: 'Gestes, messages, réponses cliquables.' },
              { n: '4', t: 'Fin / suite', d: 'Prolonger ensemble, ou clôturer.' },
            ].map((s, i) => (
              <Reveal key={s.n} delay={i * 40}>
                <article className="flex gap-3 p-1">
                  <span
                    className="shrink-0 flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold"
                    style={{
                      background: 'var(--accent-soft)',
                      color: 'var(--accent)',
                    }}
                  >
                    {s.n}
                  </span>
                  <div>
                    <h3 className="font-semibold text-sm">{s.t}</h3>
                    <p className="text-sm leading-snug mt-0.5" style={{ color: 'var(--muted)' }}>
                      {s.d}
                    </p>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
          <Reveal delay={80}>
            <div className="mt-10">
              <Link href="/start" className="btn-primary">
                Commencer un pacte
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      <section
        id="aide"
        className="py-14 md:py-16 border-t"
        style={{ borderColor: 'var(--border)', background: 'var(--accent-soft)' }}
      >
        <div className="max-w-3xl mx-auto px-4">
          <Reveal>
            <h2 className="font-serif text-2xl md:text-3xl tracking-tight leading-snug">
              En cas de besoin réel
            </h2>
            <p className="mt-4 text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>
              Ce site ne remplace pas une assistante sociale, un psychologue ou
              un médecin. Urgence immédiate : <strong>15</strong> ou{' '}
              <strong>112</strong>. Pour les personnes sourdes ou malentendantes
              : <strong>114</strong> (SMS, fax ou application — pas d’appel vocal).
            </p>
          </Reveal>

          <Reveal delay={60}>
            <div className="card-premium mt-6 p-5 md:p-6">
              <h3 className="text-sm font-semibold" style={{ color: 'var(--accent)' }}>
                Numéros d’aide (France)
              </h3>
              <ul className="mt-4 space-y-2 text-sm">
                {HELPLINES.map(([n, label]) => (
                  <li key={n} className="flex gap-3 flex-wrap items-baseline">
                    <strong
                      className="shrink-0 min-w-[7.5rem] tabular-nums"
                      style={{ color: 'var(--accent)' }}
                    >
                      {n}
                    </strong>
                    <span style={{ color: 'var(--muted)' }}>{label}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </section>

      <Footer />
    </main>
  );
}
