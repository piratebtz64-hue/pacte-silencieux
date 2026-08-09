'use client';

import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BrandBanner from '@/components/BrandBanner';
import Reveal from '@/components/Reveal';
import HomeSessionBanner from '@/components/HomeSessionBanner';
import ShareButton from '@/components/ShareButton';

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
    href: '/pour-un-proche',
    title: 'Inviter quelqu’un',
    desc: 'Tester à deux en 2 minutes',
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
          <div className="mt-11 flex flex-wrap gap-3 justify-center items-center animate-fade-up animate-delay-3">
            <Link href="/start" className="btn-primary">
              Commencer un pacte
            </Link>
            <Link href="/outils" className="btn-ghost">
              Respiration et outils
            </Link>
            <ShareButton label="Inviter quelqu’un" />
          </div>
          <p
            className="mt-6 text-xs leading-relaxed max-w-[40ch] mx-auto animate-fade-up"
            style={{ color: 'var(--muted)' }}
          >
            Fonctionne mieux à deux · même durée · page d’attente ouverte des
            deux côtés.{' '}
            <Link
              href="/pour-un-proche"
              className="underline"
              style={{ color: 'var(--accent)' }}
            >
              Comment inviter
            </Link>
          </p>
        </div>
      </section>

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

      <section className="pb-16 md:pb-24">
        <div className="max-w-md mx-auto px-4">
          <Reveal>
            <p className="section-label text-center mb-6">Aperçu</p>
            <div
              className="rounded-2xl border p-5 space-y-4"
              style={{ borderColor: 'var(--border)', background: 'var(--card)' }}
            >
              <div className="msg-bubble msg-bubble-theirs">
                <p className="msg-body">Je suis là. Pas besoin de répondre.</p>
              </div>
              <div className="msg-bubble msg-bubble-mine">
                <p className="msg-body">Merci. Ça aide un peu.</p>
              </div>
              <p className="text-xs text-center" style={{ color: 'var(--muted)' }}>
                Messages déjà écrits · pas de chat libre
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="pb-16 md:pb-24">
        <div className="max-w-3xl mx-auto px-4">
          <p className="section-label text-center mb-3">Cadence</p>
          <h2 className="font-serif text-2xl md:text-3xl text-center tracking-tight mb-10">
            Comment ça se passe
          </h2>
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              {
                t: 'Tu choisis une durée',
                d: '1, 3 ou 7 jours. Même durée des deux côtés pour le match.',
              },
              {
                t: 'Tu attends une présence',
                d: 'Si tu es seul·e : outils de respiration. Si quelqu’un arrive : pacte.',
              },
              {
                t: 'Gestes et messages',
                d: 'Déjà écrits. À la fin, vous pouvez prolonger 7 jours si les deux disent oui.',
              },
            ].map((s) => (
              <Reveal key={s.t}>
                <div>
                  <h3 className="font-semibold text-[15px]">{s.t}</h3>
                  <p
                    className="text-sm mt-1.5 leading-relaxed"
                    style={{ color: 'var(--muted)' }}
                  >
                    {s.d}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
          <div className="mt-12 text-center flex flex-wrap gap-3 justify-center items-center">
            <Link href="/start" className="btn-primary">
              Commencer un pacte
            </Link>
            <ShareButton label="Inviter quelqu’un" />
          </div>
        </div>
      </section>

      <section
        id="aide"
        className="py-16 md:py-24 border-t"
        style={{
          borderColor: 'var(--border)',
          background: 'var(--mist)',
        }}
      >
        <div className="max-w-3xl mx-auto px-4">
          <p className="section-label mb-3">Soutien réel</p>
          <h2 className="font-serif text-2xl md:text-3xl tracking-tight mb-3">
            Numéros d’aide
          </h2>
          <p className="text-sm mb-8 leading-relaxed" style={{ color: 'var(--muted)' }}>
            Ce site ne remplace pas un professionnel. En détresse, appelle.
          </p>
          <ul className="space-y-3 text-sm">
            {HELPLINES.map(([num, label]) => (
              <li key={num} className="flex flex-wrap gap-x-3 gap-y-1">
                <a
                  href={`tel:${num.replace(/\s/g, '')}`}
                  className="font-semibold tabular-nums"
                  style={{ color: 'var(--accent)' }}
                >
                  {num}
                </a>
                <span style={{ color: 'var(--muted)' }}>{label}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <Footer />
    </main>
  );
}
