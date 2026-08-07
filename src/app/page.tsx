'use client';

import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BrandBanner from '@/components/BrandBanner';
import Reveal from '@/components/Reveal';

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col">
      <Header />
      <BrandBanner />

      <section className="relative py-16 md:py-24 lg:py-28">
        <div className="max-w-6xl mx-auto px-4 grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          <div className="lg:col-span-7 animate-fade-up">
            <span className="badge">gratuit · anonyme · 1 à 7 jours</span>
            <h1 className="mt-6 font-serif text-[2.35rem] sm:text-5xl lg:text-[3.25rem] leading-[1.12] tracking-tight max-w-[20ch]">
              Si tu n’as pas envie de parler à quelqu’un, ou que tu n’as personne
              pour te soutenir en ce moment.
            </h1>
            <p
              className="mt-6 text-lg leading-relaxed max-w-[42ch]"
              style={{ color: 'var(--muted)' }}
            >
              Ici, une présence anonyme peut rester un peu avec toi. Pas de
              profil, pas de chat libre — des gestes et des messages déjà écrits,
              pour les jours où tu as besoin d’un soutien discret.
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
                    borderColor:
                      'color-mix(in srgb, var(--accent) 25%, transparent)',
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

      <section className="py-14" style={{ background: 'var(--accent-soft)' }}>
        <div className="max-w-4xl mx-auto px-4">
          <Reveal>
            <h2 className="font-serif text-2xl md:text-3xl tracking-tight">
              Avant de commencer
            </h2>
          </Reveal>
          <div className="mt-7 grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {[
              'Aucun échange libre — phrases choisies',
              'Aucun nom réel nécessaire',
              'Aucun contact direct',
              'Arrêt possible à tout moment',
              'Signalement disponible',
              'Aucune donnée vendue',
            ].map((t, i) => (
              <Reveal key={t} delay={i * 50}>
                <div className="card-premium card-premium-lift px-4 py-3.5 text-sm leading-snug h-full">
                  {t}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section id="comment" className="py-20 md:py-28">
        <div className="max-w-6xl mx-auto px-4">
          <Reveal>
            <h2 className="font-serif text-3xl md:text-4xl tracking-tight max-w-[16ch]">
              Comment ça marche
            </h2>
            <p className="mt-3 max-w-[42ch] leading-relaxed" style={{ color: 'var(--muted)' }}>
              Quatre étapes simples. Une présence entre deux personnes qui ne se
              connaissent pas.
            </p>
          </Reveal>
          <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { n: '01', t: 'Tu choisis une durée', d: '1, 3 ou 7 jours. Environ 2 minutes pour démarrer.' },
              { n: '02', t: 'Tu es relié à quelqu’un', d: 'Une autre personne, anonyme, même durée. Pas de profil.' },
              { n: '03', t: 'Vous restez présents', d: 'Gestes et messages déjà écrits. Réponses parmi des options.' },
              { n: '04', t: 'Vous pouvez prolonger', d: 'En fin de cycle, Oui / Non des deux côtés pour +7 jours.' },
            ].map((s, i) => (
              <Reveal key={s.n} delay={i * 70}>
                <article className="card-premium card-premium-lift p-6 h-full">
                  <span className="text-xs font-bold tracking-[0.12em]" style={{ color: 'var(--accent)' }}>
                    {s.n}
                  </span>
                  <h3 className="mt-4 text-lg font-semibold tracking-tight">{s.t}</h3>
                  <p className="mt-2 text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>
                    {s.d}
                  </p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20">
        <div className="max-w-6xl mx-auto px-4">
          <Reveal>
            <h2 className="font-serif text-3xl md:text-4xl tracking-tight max-w-[14ch]">
              Ce que ce n’est pas
            </h2>
          </Reveal>
          <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { t: 'Pas un chat', d: 'Aucun message libre. Uniquement des phrases choisies.' },
              { t: 'Pas un réseau social', d: 'Pas de profil, pas de likes, pas de followers.' },
              { t: 'Pas une rencontre', d: 'Une seule personne, un temps limité.' },
              { t: 'Pas un professionnel', d: 'Ne remplace ni assistante sociale, ni psychologue, ni médecin.' },
            ].map((item, i) => (
              <Reveal key={item.t} delay={i * 60}>
                <article className="card-premium card-premium-lift p-6 h-full">
                  <h3 className="text-lg font-semibold tracking-tight">{item.t}</h3>
                  <p className="mt-2 text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>
                    {item.d}
                  </p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section
        id="aide"
        className="py-16 md:py-20 border-y"
        style={{ borderColor: 'var(--border)', background: 'var(--accent-soft)' }}
      >
        <div className="max-w-3xl mx-auto px-4">
          <Reveal>
            <h2 className="font-serif text-3xl md:text-4xl tracking-tight leading-snug">
              Important : ce site n’est pas une aide professionnelle
            </h2>
            <p className="mt-6 leading-relaxed" style={{ color: 'var(--muted)' }}>
              <strong style={{ color: 'var(--foreground)' }}>
                Le Pacte silencieux ne remplace pas une assistante sociale
              </strong>
              , un psychologue ou un médecin. Soutien discret entre pairs,
              uniquement.
            </p>
          </Reveal>
          <Reveal delay={80}>
            <div className="card-premium mt-10 p-6 md:p-8">
              <h3 className="text-base font-semibold" style={{ color: 'var(--accent)' }}>
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
                    <strong className="shrink-0" style={{ color: 'var(--accent)' }}>
                      {n}
                    </strong>
                    <span style={{ color: 'var(--muted)' }}>— {label}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="py-20 md:py-28">
        <Reveal>
          <div className="max-w-2xl mx-auto px-4 text-center">
            <h2 className="font-serif text-3xl md:text-4xl leading-snug tracking-tight">
              Pas envie de parler, ou personne autour pour te soutenir ? Ce pacte
              peut t’offrir une présence discrète, le temps qu’il faut.
            </h2>
            <Link href="/start" className="btn-primary mt-10 inline-flex text-base">
              Commencer un pacte de présence
            </Link>
            <p className="mt-4 text-xs" style={{ color: 'var(--muted)' }}>
              Gratuit · anonyme · 2 minutes pour commencer
            </p>
          </div>
        </Reveal>
      </section>

      <Footer />
    </main>
  );
}
