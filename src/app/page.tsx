'use client';

import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BrandBanner from '@/components/BrandBanner';
import Reveal from '@/components/Reveal';
import HomeSessionBanner from '@/components/HomeSessionBanner';

const HELPLINES: [string, string][] = [
  ['09 72 39 40 50', 'SOS Amitié — écoute et soutien'],
  ['0 800 858 858', 'Croix-Rouge Écoute'],
  ['0 800 23 13 13', 'Fil Santé Jeunes'],
  ['3919', 'Violences faites aux femmes (24h/24)'],
  ['119', 'Enfance en danger (24h/24)'],
  ['3977', 'Maltraitance personnes âgées / handicap'],
  ['0 800 200 000', 'Drogues Info Service'],
  ['0 800 39 40 50', 'Alcool Info Service'],
  ['15', 'SAMU — urgence médicale'],
  ['112', 'Urgences (Europe)'],
  ['18', 'Pompiers'],
  ['17', 'Police / gendarmerie'],
  ['114', 'Urgence sourds et malentendants — SMS, fax ou appli'],
  ['3114', 'Prévention du suicide (24h/24, gratuit)'],
];

const QUICK = [
  {
    href: '/start',
    title: 'Commencer un pacte',
    desc: '1, 3 ou 7 jours · présence anonyme',
  },
  {
    href: '/outils?outil=coherence',
    title: 'Cohérence cardiaque',
    desc: 'Respiration 5/5 guidée',
  },
  {
    href: '/outils?outil=breath',
    title: 'Respirations',
    desc: '4/6 · carré · soupir · 4-7-8',
  },
  {
    href: '/outils?outil=ground',
    title: 'Ancrage 5-4-3-2-1',
    desc: 'Revenir dans le corps',
  },
  {
    href: '/selection',
    title: 'Sélection empathique',
    desc: 'Clarifier ce dont tu as besoin',
  },
  {
    href: '/#aide',
    title: 'Numéros d’aide',
    desc: 'Écoute et urgences (France)',
  },
] as const;

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col">
      <Header />
      <HomeSessionBanner />
      <BrandBanner />

      {/* HERO */}
      <section className="hero-silence">
        <div className="hero-orb" aria-hidden />
        <div className="hero-orb-2" aria-hidden />
        <div className="max-w-3xl mx-auto px-4 text-center relative">
          <div className="flex justify-center mb-8 animate-fade-up">
            <div className="pact-breath" />
          </div>
          <span className="badge animate-fade-up">
            <span
              className="inline-block w-1.5 h-1.5 rounded-full"
              style={{ background: 'var(--accent)' }}
            />
            gratuit · anonyme · 1 à 7 jours
          </span>
          <h1 className="mt-8 font-serif text-[2.15rem] sm:text-[2.85rem] lg:text-[3.25rem] leading-[1.12] tracking-tight max-w-[16ch] mx-auto animate-fade-up animate-delay-1">
            Une présence, sans avoir à tout dire.
          </h1>
          <p
            className="mt-7 text-base sm:text-lg leading-relaxed max-w-[36ch] mx-auto animate-fade-up animate-delay-2"
            style={{ color: 'var(--muted)' }}
          >
            Quand personne n’est disponible près de toi : gestes et messages déjà
            écrits, sans chat libre. Un complément — pas un remplacement des
            proches ni des professionnels.
          </p>
          <div className="mt-11 flex flex-wrap gap-3 justify-center animate-fade-up animate-delay-3">
            <Link href="/start" className="btn-primary">
              Commencer un pacte
            </Link>
            <Link href="/outils" className="btn-ghost">
              Respiration et outils
            </Link>
          </div>
        </div>
      </section>

      {/* ACCÈS */}
      <section className="pb-16 md:pb-20">
        <div className="max-w-3xl mx-auto px-4">
          <p className="section-label text-center mb-3">Parcours</p>
          <h2 className="font-serif text-2xl md:text-3xl text-center tracking-tight mb-8">
            Accès directs
          </h2>
          <div className="grid sm:grid-cols-2 gap-3.5">
            {QUICK.map((q) => (
              <Link key={q.href} href={q.href} className="access-card">
                <span className="font-semibold text-sm block">{q.title}</span>
                <span
                  className="block text-xs mt-1.5 leading-relaxed"
                  style={{ color: 'var(--muted)' }}
                >
                  {q.desc}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* EXEMPLE D’ÉCHANGE */}
      <section className="pb-16 md:pb-24">
        <div className="max-w-md mx-auto px-4">
          <Reveal>
            <div className="card-premium p-7 md:p-9">
              <p className="section-label text-center mb-6">Aperçu</p>
              <div className="space-y-4">
                <div
                  className="p-4 rounded-2xl"
                  style={{ background: 'var(--warm)' }}
                >
                  <p
                    className="text-[10px] uppercase tracking-wider mb-2"
                    style={{ color: 'var(--muted)' }}
                  >
                    Présence
                  </p>
                  <p className="font-serif text-[1.08rem] leading-snug">
                    Si c’est lourd aujourd’hui, tu n’as pas à le porter seul.
                  </p>
                </div>
                <div
                  className="p-4 rounded-2xl ml-4"
                  style={{ background: 'var(--accent-soft)' }}
                >
                  <p
                    className="text-[10px] uppercase tracking-wider mb-2 font-medium"
                    style={{ color: 'var(--accent)' }}
                  >
                    Réponse choisie
                  </p>
                  <p className="font-serif text-[1.08rem] leading-snug">
                    Merci. Ça m’aide un peu.
                  </p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* TONS */}
      <section
        id="tons"
        className="py-16 md:py-24 border-t"
        style={{ borderColor: 'var(--border)' }}
      >
        <div className="max-w-2xl mx-auto px-4">
          <Reveal>
            <p className="section-label text-center mb-3">Cadence</p>
            <h2 className="font-serif text-2xl md:text-3xl tracking-tight text-center max-w-[14ch] mx-auto">
              Trois tons, une même prudence
            </h2>
            <p
              className="mt-5 text-sm leading-relaxed text-center max-w-[38ch] mx-auto"
              style={{ color: 'var(--muted)' }}
            >
              L’échange ne s’emballe pas. On commence doux. On monte seulement si
              la personne le choisit.
            </p>
          </Reveal>
          <div className="mt-12 grid gap-4">
            {[
              {
                n: '01',
                t: 'Présence douce',
                d: 'Messages courts, sans pression. Juste rester là.',
              },
              {
                n: '02',
                t: 'Validation',
                d: 'Reconnaître ce qui est difficile, sans minimiser.',
              },
              {
                n: '03',
                t: 'Outils si besoin',
                d: 'Respiration, ancrage — seulement si tu le choisis.',
              },
            ].map((s) => (
              <Reveal key={s.n}>
                <div
                  className="flex gap-5 p-5 rounded-2xl border"
                  style={{
                    borderColor: 'var(--border)',
                    background: 'var(--card-solid)',
                  }}
                >
                  <span
                    className="shrink-0 font-serif text-lg tabular-nums"
                    style={{ color: 'var(--accent)' }}
                  >
                    {s.n}
                  </span>
                  <div>
                    <h3 className="font-semibold text-[15px]">{s.t}</h3>
                    <p
                      className="text-sm mt-1.5 leading-relaxed"
                      style={{ color: 'var(--muted)' }}
                    >
                      {s.d}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
          <div className="mt-12 text-center flex flex-wrap gap-3 justify-center">
            <Link href="/start" className="btn-primary">
              Commencer un pacte
            </Link>
            <Link href="/outils" className="btn-ghost">
              Voir les outils
            </Link>
          </div>
        </div>
      </section>

      {/* AIDE */}
      <section
        id="aide"
        className="py-16 md:py-24 border-t"
        style={{
          borderColor: 'var(--border)',
          background: 'var(--mist)',
        }}
      >
        <div className="max-w-2xl mx-auto px-4">
          <Reveal>
            <p className="section-label mb-3">Soutien réel</p>
            <h2 className="font-serif text-2xl md:text-3xl tracking-tight leading-snug">
              En cas de besoin
            </h2>
            <p
              className="mt-5 text-sm leading-relaxed max-w-[42ch]"
              style={{ color: 'var(--muted)' }}
            >
              Ce site ne remplace pas un psychologue ou un médecin. Pour une
              écoute humaine : SOS Amitié ou Croix-Rouge. Urgence :{' '}
              <strong>15</strong> ou <strong>112</strong>.
            </p>
          </Reveal>
          <Reveal delay={60}>
            <div className="card-premium mt-10 p-6 md:p-8">
              <h3
                className="text-sm font-semibold"
                style={{ color: 'var(--accent)' }}
              >
                Numéros d’aide (France)
              </h3>
              <ul className="mt-5 space-y-3 text-sm">
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
