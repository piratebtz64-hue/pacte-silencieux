'use client';

import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BrandBanner from '@/components/BrandBanner';

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col">
      <Header />
      <BrandBanner />

      {/* HERO */}
      <section className="relative py-16 md:py-24 lg:py-28">
        <div className="max-w-6xl mx-auto px-4 grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          <div className="lg:col-span-7 animate-fade-up">
            <span className="badge">gratuit · anonyme · 1 à 7 jours</span>
            <h1 className="mt-6 font-serif text-[2.35rem] sm:text-5xl lg:text-[3.35rem] leading-[1.12] tracking-tight max-w-[16ch]">
              Pendant quelques jours, une personne reste là avec toi.
            </h1>
            <p
              className="mt-6 text-lg leading-relaxed max-w-[40ch]"
              style={{ color: 'var(--muted)' }}
            >
              Pas de profil. Pas de chat libre. Des gestes et des messages déjà
              écrits — pour les jours où parler est trop lourd.
            </p>
            <div className="mt-9 flex flex-wrap gap-3 items-center">
              <Link href="/start" className="btn-primary">
                Commencer un pacte de présence
              </Link>
              <Link href="#comment" className="btn-ghost">
                Comment ça marche
              </Link>
            </div>
            <p className="mt-4 text-xs tracking-wide" style={{ color: 'var(--muted)' }}>
              Gratuit · anonyme · environ 2 minutes pour commencer
            </p>
          </div>

          <div className="lg:col-span-5 animate-fade-up animate-delay-2">
            <div className="card-premium p-7 md:p-8 relative overflow-hidden">
              <div
                className="pointer-events-none absolute -top-20 -right-20 h-40 w-40 rounded-full opacity-40"
                style={{
                  background:
                    'radial-gradient(circle, var(--accent-soft), transparent 70%)',
                }}
              />
              <p
                className="text-[10px] uppercase tracking-[0.16em] font-bold mb-5"
                style={{ color: 'var(--muted)' }}
              >
                Exemple d’échange
              </p>
              <div className="space-y-3.5">
                <div
                  className="p-4 rounded-2xl border"
                  style={{
                    borderColor: 'var(--border)',
                    background: 'var(--card-solid)',
                  }}
                >
                  <p className="text-[11px] mb-1.5" style={{ color: 'var(--muted)' }}>
                    Quelqu’un t’écrit
                  </p>
                  <p className="text-[0.95rem] leading-snug font-medium">
                    « Si c’est lourd aujourd’hui, tu n’as pas à le porter seul. »
                  </p>
                </div>
                <div
                  className="p-4 rounded-2xl ml-3 border"
                  style={{
                    borderColor: 'color-mix(in srgb, var(--accent) 25%, transparent)',
                    background: 'var(--accent-soft)',
                  }}
                >
                  <p
                    className="text-[11px] mb-1.5 font-medium"
                    style={{ color: 'var(--accent)' }}
                  >
                    Tu choisis une réponse
                  </p>
                  <p className="text-[0.95rem] leading-snug font-medium">
                    « Merci. Ça m’aide un peu. »
                  </p>
                </div>
                <div
                  className="p-4 rounded-2xl border"
                  style={{
                    borderColor: 'var(--border)',
                    background: 'var(--card-solid)',
                  }}
                >
                  <p className="text-[11px] mb-1.5" style={{ color: 'var(--muted)' }}>
                    Ou un geste silencieux
                  </p>
                  <p className="text-[0.95rem] font-medium">Je suis là.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CONFIANCE */}
      <section className="py-14" style={{ background: 'var(--accent-soft)' }}>
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="font-serif text-2xl md:text-3xl tracking-tight">
            Avant de commencer
          </h2>
          <div className="mt-7 grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {[
              'Aucun échange libre — phrases choisies',
              'Aucun nom réel nécessaire',
              'Aucun contact direct',
              'Arrêt possible à tout moment',
              'Signalement disponible',
              'Aucune donnée vendue',
            ].map((t) => (
              <div
                key={t}
                className="card-premium px-4 py-3.5 text-sm leading-snug"
              >
                {t}
              </div>
            ))}
          </div>
          <p className="mt-5 text-xs" style={{ color: 'var(--muted)' }}>
            Détails :{' '}
            <Link href="/confidentialite" className="underline" style={{ color: 'var(--accent)' }}>
              confidentialité
            </Link>
          </p>
        </div>
      </section>

      {/* COMMENT */}
      <section id="comment" className="py-20 md:py-28">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="font-serif text-3xl md:text-4xl tracking-tight max-w-[16ch]">
            Comment ça marche
          </h2>
          <p className="mt-3 max-w-[42ch] leading-relaxed" style={{ color: 'var(--muted)' }}>
            Quatre étapes simples. Une présence entre deux personnes qui ne se
            connaissent pas.
          </p>
          <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              {
                n: '01',
                t: 'Tu choisis une durée',
                d: '1, 3 ou 7 jours. Environ 2 minutes pour démarrer.',
              },
              {
                n: '02',
                t: 'Tu es relié à quelqu’un',
                d: 'Une autre personne, anonyme, même durée. Pas de profil.',
              },
              {
                n: '03',
                t: 'Vous restez présents',
                d: 'Gestes et messages déjà écrits. Réponses parmi des options.',
              },
              {
                n: '04',
                t: 'Vous pouvez prolonger',
                d: 'En fin de cycle, Oui / Non des deux côtés pour +7 jours.',
              },
            ].map((s) => (
              <article
                key={s.n}
                className="card-premium card-premium-lift p-6"
              >
                <span
                  className="text-xs font-bold tracking-[0.12em]"
                  style={{ color: 'var(--accent)' }}
                >
                  {s.n}
                </span>
                <h3 className="mt-4 text-lg font-semibold tracking-tight">{s.t}</h3>
                <p
                  className="mt-2 text-sm leading-relaxed"
                  style={{ color: 'var(--muted)' }}
                >
                  {s.d}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CE QUE CE N’EST PAS */}
      <section className="py-16 md:py-20">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="font-serif text-3xl md:text-4xl tracking-tight max-w-[14ch]">
            Ce que ce n’est pas
          </h2>
          <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
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
                d: 'Ne remplace ni assistante sociale, ni psychologue, ni médecin.',
              },
            ].map((item) => (
              <article key={item.t} className="card-premium p-6">
                <h3 className="text-lg font-semibold tracking-tight">{item.t}</h3>
                <p
                  className="mt-2 text-sm leading-relaxed"
                  style={{ color: 'var(--muted)' }}
                >
                  {item.d}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* AIDE */}
      <section
        id="aide"
        className="py-16 md:py-20 border-y"
        style={{
          borderColor: 'var(--border)',
          background: 'var(--accent-soft)',
        }}
      >
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="font-serif text-3xl md:text-4xl tracking-tight leading-snug">
            Important : ce site n’est pas une aide professionnelle
          </h2>
          <div
            className="mt-6 space-y-3 text-[0.95rem] leading-relaxed"
            style={{ color: 'var(--muted)' }}
          >
            <p>
              <strong style={{ color: 'var(--foreground)' }}>
                Le Pacte silencieux ne remplace pas une assistante sociale
              </strong>
              , un travailleur social, un psychologue ou un médecin.
            </p>
            <p>
              C’est un espace de présence anonyme entre pairs, avec des messages
              déjà écrits. Ni suivi, ni diagnostic, ni prise en charge.
            </p>
          </div>
          <div className="card-premium mt-10 p-6 md:p-8">
            <h3
              className="text-base font-semibold"
              style={{ color: 'var(--accent)' }}
            >
              En cas de détresse (France)
            </h3>
            <ul className="mt-5 space-y-2.5 text-sm">
              {[
                ['3114', 'Prévention du suicide (24h/24)'],
                ['15', 'SAMU'],
                ['112', 'Urgences'],
                ['119', 'Enfance en danger'],
                ['3919', 'Violences faites aux femmes'],
                ['0 800 23 13 13', 'Fil Santé Jeunes'],
              ].map(([n, label]) => (
                <li key={n} className="flex gap-3">
                  <strong
                    className="shrink-0 tabular-nums"
                    style={{ color: 'var(--accent)' }}
                  >
                    {n}
                  </strong>
                  <span style={{ color: 'var(--muted)' }}>— {label}</span>
                </li>
              ))}
            </ul>
            <p className="mt-5 text-xs" style={{ color: 'var(--muted)' }}>
              En urgence immédiate : 15 ou 112. Ce site n’est pas un service
              d’urgence.
            </p>
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="py-20 md:py-28">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h2 className="font-serif text-3xl md:text-4xl leading-snug tracking-tight">
            Tu n’as pas à parler. Quelqu’un peut quand même rester un peu avec
            toi.
          </h2>
          <Link href="/start" className="btn-primary mt-10 inline-flex text-base">
            Commencer un pacte de présence
          </Link>
          <p className="mt-4 text-xs" style={{ color: 'var(--muted)' }}>
            Gratuit · anonyme · 2 minutes pour commencer
          </p>
          <p className="mt-6 text-xs" style={{ color: 'var(--muted)' }}>
            En détresse ?{' '}
            <a href="#aide" className="underline" style={{ color: 'var(--accent)' }}>
              Voir les numéros d’aide
            </a>
          </p>
        </div>
      </section>

      <Footer />
    </main>
  );
}
