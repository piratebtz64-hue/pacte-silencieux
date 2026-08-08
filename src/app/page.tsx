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

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col">
      <Header />
      <HomeSessionBanner />
      <BrandBanner />

      {/* ——— HERO ——— */}
      <section className="hero-silence">
        <div className="hero-orb" aria-hidden />
        <div className="max-w-3xl mx-auto px-4 text-center relative">
          <div className="flex justify-center mb-6 animate-fade-up">
            <div className="pact-breath" />
          </div>
          <span className="badge animate-fade-up">gratuit · anonyme · 1 à 7 jours</span>
          <h1 className="mt-6 font-serif text-[2rem] sm:text-[2.65rem] lg:text-[3rem] leading-[1.18] tracking-tight max-w-[18ch] mx-auto animate-fade-up animate-delay-1">
            Quand personne n’est près de toi pour en parler — et que tu as besoin
            d’un peu de soutien.
          </h1>
          <p
            className="mt-6 text-base sm:text-lg leading-relaxed max-w-[38ch] mx-auto animate-fade-up animate-delay-2"
            style={{ color: 'var(--muted)' }}
          >
            Une présence anonyme entre pairs : gestes et messages déjà écrits,
            sans chat libre. Un{' '}
            <strong style={{ color: 'var(--foreground)' }}>complément</strong>{' '}
            quand l’entourage n’est pas disponible — pas un remplacement des
            proches, des assistantes sociales, ni des professionnels de santé.
          </p>
          <div className="mt-10 flex flex-wrap gap-3 justify-center animate-fade-up animate-delay-3">
            <Link href="/start" className="btn-primary">
              Commencer un pacte
            </Link>
            <a href="#tons" className="btn-ghost">
              Comment on prend soin
            </a>
          </div>
        </div>
      </section>

      {/* ——— EXEMPLE ——— */}
      <section className="pb-16 md:pb-20">
        <div className="max-w-md mx-auto px-4">
          <Reveal>
            <div className="card-premium p-6 md:p-8">
              <p
                className="text-[10px] uppercase tracking-[0.14em] font-semibold mb-5 text-center"
                style={{ color: 'var(--muted)' }}
              >
                Un échange possible
              </p>
              <div className="space-y-3.5">
                <div
                  className="p-4 rounded-2xl"
                  style={{ background: 'var(--warm)' }}
                >
                  <p className="text-[11px] mb-1.5" style={{ color: 'var(--muted)' }}>
                    Présence
                  </p>
                  <p className="font-serif text-[1.05rem] leading-snug">
                    Si c’est lourd aujourd’hui, tu n’as pas à le porter seul.
                  </p>
                </div>
                <div
                  className="p-4 rounded-2xl ml-3"
                  style={{ background: 'var(--accent-soft)' }}
                >
                  <p
                    className="text-[11px] mb-1.5 font-medium"
                    style={{ color: 'var(--accent)' }}
                  >
                    Réponse choisie
                  </p>
                  <p className="font-serif text-[1.05rem] leading-snug">
                    Merci. Ça m’aide un peu.
                  </p>
                </div>
                <div
                  className="p-4 rounded-2xl border text-center"
                  style={{ borderColor: 'var(--border)' }}
                >
                  <p className="text-[11px] mb-1" style={{ color: 'var(--muted)' }}>
                    Ou un geste
                  </p>
                  <p className="font-serif text-lg">Je suis là.</p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ——— ÉCHELLE EMPATHIE ——— */}
      <section
        id="tons"
        className="py-16 md:py-20 border-t"
        style={{ borderColor: 'var(--border)' }}
      >
        <div className="max-w-2xl mx-auto px-4">
          <Reveal>
            <h2 className="font-serif text-2xl md:text-3xl tracking-tight text-center max-w-[16ch] mx-auto">
              Trois tons, une même prudence
            </h2>
            <p
              className="mt-4 text-sm leading-relaxed text-center max-w-[40ch] mx-auto"
              style={{ color: 'var(--muted)' }}
            >
              L’échange ne s’emballe pas. On commence doux. On monte seulement
              si la personne le choisit.
            </p>
          </Reveal>

          <div className="mt-10 space-y-3">
            <Reveal delay={40}>
              <div className="tone-step">
                <span className="tone-dot" />
                <div>
                  <p className="text-sm font-semibold">Présence</p>
                  <p className="mt-1 text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>
                    « Je suis là. » « Doucement. » Aucune question, aucune solution.
                    Juste ne pas être seul·e un instant.
                  </p>
                </div>
              </div>
            </Reveal>
            <Reveal delay={80}>
              <div className="tone-step">
                <span className="tone-dot tone-dot-2" />
                <div>
                  <p className="text-sm font-semibold">Reconnaissance</p>
                  <p className="mt-1 text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>
                    Nommer un peu ce qui pèse, sans forcer le récit. Valider.
                    Laisser la place de répondre — ou non.
                  </p>
                </div>
              </div>
            </Reveal>
            <Reveal delay={120}>
              <div className="tone-step">
                <span className="tone-dot tone-dot-3" />
                <div>
                  <p className="text-sm font-semibold">Ancrage</p>
                  <p className="mt-1 text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>
                    Si ça déborde : outils de crise doux (respiration, sol),
                    et les numéros humains en bas de page. Jamais d’escalade
                    poussée par le site.
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ——— CADRE ——— */}
      <section className="pb-16 md:pb-20">
        <div className="max-w-4xl mx-auto px-4 grid sm:grid-cols-3 gap-4">
          {[
            {
              t: 'Cadre sûr',
              d: 'Pas de message libre : phrases et gestes choisis. Pas de profil public.',
            },
            {
              t: 'Temps limité',
              d: '1, 3 ou 7 jours. À la fin : prolonger ensemble, ou s’arrêter.',
            },
            {
              t: 'Complément',
              d: 'Quand l’entourage n’est pas là. Si ça dépasse : numéros ci-dessous.',
            },
          ].map((item, i) => (
            <Reveal key={item.t} delay={i * 50}>
              <article className="card-premium p-5 h-full">
                <h2 className="text-base font-semibold tracking-tight">{item.t}</h2>
                <p
                  className="mt-2 text-sm leading-relaxed"
                  style={{ color: 'var(--muted)' }}
                >
                  {item.d}
                </p>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ——— STEPS ——— */}
      <section
        id="comment"
        className="py-16 md:py-20 border-t"
        style={{ borderColor: 'var(--border)' }}
      >
        <div className="max-w-3xl mx-auto px-4">
          <Reveal>
            <h2 className="font-serif text-2xl md:text-3xl tracking-tight text-center">
              Comment ça marche
            </h2>
          </Reveal>
          <div className="mt-12 space-y-8">
            {[
              { n: '1', t: 'Tu choisis une durée', d: '1, 3 ou 7 jours.' },
              {
                n: '2',
                t: 'Une présence te rejoint',
                d: 'Quelqu’un d’anonyme, la même durée.',
              },
              {
                n: '3',
                t: 'Vous échangez sans chat libre',
                d: 'Gestes, messages, réponses cliquables.',
              },
              {
                n: '4',
                t: 'Vous clôturez — ou prolongez',
                d: 'Ensemble, d’une semaine, si les deux le veulent.',
              },
            ].map((s, i) => (
              <Reveal key={s.n} delay={i * 40}>
                <div className="flex gap-5 items-start">
                  <span
                    className="shrink-0 flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold font-serif"
                    style={{
                      background: 'var(--accent-soft)',
                      color: 'var(--accent)',
                    }}
                  >
                    {s.n}
                  </span>
                  <div className="pt-1.5">
                    <h3 className="font-semibold">{s.t}</h3>
                    <p className="text-sm mt-1" style={{ color: 'var(--muted)' }}>
                      {s.d}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal delay={100}>
            <div className="mt-12 text-center">
              <Link href="/start" className="btn-primary">
                Commencer un pacte
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ——— AIDE ——— */}
      <section
        id="aide"
        className="py-16 md:py-20 border-t"
        style={{ borderColor: 'var(--border)', background: 'var(--accent-soft)' }}
      >
        <div className="max-w-2xl mx-auto px-4">
          <Reveal>
            <h2 className="font-serif text-2xl md:text-3xl tracking-tight leading-snug">
              En cas de besoin réel
            </h2>
            <p className="mt-4 text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>
              Ce site ne remplace pas une assistante sociale, un psychologue ou
              un médecin. Pour une écoute humaine : SOS Amitié ou Croix-Rouge.
              Urgence : <strong>15</strong> ou <strong>112</strong>. Sourds et
              malentendants : <strong>114</strong>.
            </p>
          </Reveal>

          <Reveal delay={60}>
            <div className="card-premium mt-8 p-5 md:p-6">
              <h3 className="text-sm font-semibold" style={{ color: 'var(--accent)' }}>
                Numéros d’aide (France)
              </h3>
              <ul className="mt-4 space-y-2.5 text-sm">
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
