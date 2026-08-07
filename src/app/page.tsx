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
  ['114', 'Urgence pour personnes sourdes / malentendantes'],
];

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col">
      <Header />
      <BrandBanner />

      {/* Hero */}
      <section className="relative py-16 md:py-24 lg:py-28">
        <div className="max-w-6xl mx-auto px-4 grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          <div className="lg:col-span-7 animate-fade-up">
            <span className="badge">gratuit · anonyme · 1 à 7 jours</span>
            <h1 className="mt-6 font-serif text-[2.25rem] sm:text-5xl lg:text-[3.15rem] leading-[1.12] tracking-tight max-w-[22ch]">
              Quand tu n’as pas envie de parler à quelqu’un de réel, ou que
              personne n’est disponible en ce moment.
            </h1>
            <p
              className="mt-6 text-lg leading-relaxed max-w-[44ch]"
              style={{ color: 'var(--muted)' }}
            >
              Le Pacte silencieux est une <strong style={{ color: 'var(--foreground)' }}>présence anonyme entre pairs</strong> :
              des gestes et des messages déjà écrits, sans chat libre, sans
              profil. Ce n’est <strong style={{ color: 'var(--foreground)' }}>pas</strong> un service d’assistante
              sociale, de psychologie ou de médecine.
            </p>
            <div className="mt-9 flex flex-wrap gap-3 items-center">
              <Link href="/start" className="btn-primary">
                Commencer un pacte de présence
              </Link>
              <Link href="#concepts" className="btn-ghost">
                Comprendre le concept
              </Link>
            </div>
            <p className="mt-4 text-xs tracking-wide" style={{ color: 'var(--muted)' }}>
              Gratuit · anonyme · environ 2 minutes pour commencer
            </p>
          </div>

          <div className="lg:col-span-5 animate-fade-up animate-delay-2">
            <div className="card-premium p-7 md:p-8">
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

      {/* Concepts */}
      <section id="concepts" className="py-16 md:py-22">
        <div className="max-w-6xl mx-auto px-4">
          <Reveal>
            <h2 className="font-serif text-3xl md:text-4xl tracking-tight max-w-[18ch]">
              Le concept, clairement
            </h2>
            <p className="mt-4 max-w-2xl leading-relaxed" style={{ color: 'var(--muted)' }}>
              Cette application existe pour les moments où tu n’as pas envie de
              parler à un proche en vrai, ou où personne n’est présent pour toi
              tout de suite. Elle offre un fil discret — pas un suivi
              professionnel.
            </p>
          </Reveal>

          <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              {
                t: 'Présence, pas thérapie',
                d: 'Deux personnes anonymes se tiennent avec des messages déjà écrits. Aucun diagnostic, aucun conseil médical, aucun suivi social officiel.',
              },
              {
                t: 'Sans conversation libre',
                d: 'Pas de chat ouvert. Tu choisis parmi des phrases et des gestes. Ça limite les dérapages et garde un cadre sûr.',
              },
              {
                t: 'Temps limité',
                d: '1, 3 ou 7 jours. En fin de cycle, les deux peuvent voter pour prolonger d’une semaine — ou s’arrêter proprement.',
              },
              {
                t: 'Reconnexion possible',
                d: 'Avec le même email, tu reprends ton pacte actif et tout l’historique des échanges pendant la durée choisie.',
              },
              {
                t: 'Rôles fluides',
                d: 'Tu peux soutenir, demander du soutien, ou les deux. Pas de profil public, pas de score, pas de popularité.',
              },
              {
                t: 'Complément, pas substitut',
                d: 'Utile entre deux rendez-vous ou quand tu es seul·e le soir. Dès que ça dépasse : numéros d’aide et professionnels.',
              },
            ].map((item, i) => (
              <Reveal key={item.t} delay={i * 50}>
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

      {/* Ce que ce n’est pas */}
      <section className="py-16" style={{ background: 'var(--accent-soft)' }}>
        <div className="max-w-6xl mx-auto px-4">
          <Reveal>
            <h2 className="font-serif text-3xl md:text-4xl tracking-tight">
              Ce que ce n’est pas
            </h2>
          </Reveal>
          <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              {
                t: 'Pas un chat',
                d: 'Aucun message libre. Uniquement des phrases et gestes choisis.',
              },
              {
                t: 'Pas un réseau social',
                d: 'Pas de profil, likes, followers ou fil public.',
              },
              {
                t: 'Pas une rencontre',
                d: 'Une seule personne, un temps limité, anonymat conservé.',
              },
              {
                t: 'Pas un professionnel',
                d: 'Ne remplace ni assistante sociale, ni psychologue, ni médecin.',
              },
            ].map((item, i) => (
              <Reveal key={item.t} delay={i * 50}>
                <article className="card-premium p-6 h-full">
                  <h3 className="text-lg font-semibold">{item.t}</h3>
                  <p className="mt-2 text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>
                    {item.d}
                  </p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Comment ça marche */}
      <section id="comment" className="py-20 md:py-28">
        <div className="max-w-6xl mx-auto px-4">
          <Reveal>
            <h2 className="font-serif text-3xl md:text-4xl tracking-tight">
              Comment ça marche
            </h2>
          </Reveal>
          <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              {
                n: '01',
                t: 'Tu choisis une durée',
                d: '1, 3 ou 7 jours. Même email = tu peux te reconnecter et reprendre le Fil.',
              },
              {
                n: '02',
                t: 'Tu es relié à quelqu’un',
                d: 'Une autre personne anonyme, même durée. Pas de nom, pas de photo.',
              },
              {
                n: '03',
                t: 'Vous restez présents',
                d: 'Gestes, messages, réponses cliquables, scénarios de crise. Échanges illimités.',
              },
              {
                n: '04',
                t: 'Vous pouvez prolonger',
                d: 'En fin de cycle : Oui / Non des deux côtés pour +7 jours, ou clôture digne.',
              },
            ].map((s, i) => (
              <Reveal key={s.n} delay={i * 60}>
                <article className="card-premium card-premium-lift p-6 h-full">
                  <span
                    className="text-xs font-bold tracking-[0.12em]"
                    style={{ color: 'var(--accent)' }}
                  >
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

      {/* Aide — numéros complets */}
      <section
        id="aide"
        className="py-16 md:py-20 border-y"
        style={{ borderColor: 'var(--border)', background: 'var(--accent-soft)' }}
      >
        <div className="max-w-3xl mx-auto px-4">
          <Reveal>
            <h2 className="font-serif text-3xl md:text-4xl tracking-tight leading-snug">
              Important : ce n’est pas une aide professionnelle
            </h2>
            <p className="mt-6 leading-relaxed" style={{ color: 'var(--muted)' }}>
              <strong style={{ color: 'var(--foreground)' }}>
                Le Pacte silencieux ne remplace pas une assistante sociale
              </strong>
              , un travailleur social, un psychologue, un psychiatre ou un
              médecin. C’est un espace de présence anonyme entre pairs, avec des
              messages déjà écrits. Ni suivi, ni diagnostic, ni prise en charge.
            </p>
            <p className="mt-4 leading-relaxed" style={{ color: 'var(--muted)' }}>
              En urgence immédiate : <strong>15</strong> ou <strong>112</strong>.
              Ce site n’est pas un service d’urgence.
            </p>
          </Reveal>

          <Reveal delay={80}>
            <div className="card-premium mt-10 p-6 md:p-8">
              <h3
                className="text-base font-semibold"
                style={{ color: 'var(--accent)' }}
              >
                Numéros d’aide (France)
              </h3>
              <ul className="mt-5 space-y-2.5 text-sm">
                {HELPLINES.map(([n, label]) => (
                  <li key={n} className="flex gap-3 flex-wrap">
                    <strong className="shrink-0" style={{ color: 'var(--accent)' }}>
                      {n}
                    </strong>
                    <span style={{ color: 'var(--muted)' }}>— {label}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          <Reveal delay={120}>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/start" className="btn-primary !text-sm">
                Commencer un pacte
              </Link>
              <Link href="/selection" className="btn-ghost !text-sm">
                Comment tu te sens ?
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* CTA final */}
      <section className="py-20 md:py-28">
        <Reveal>
          <div className="max-w-2xl mx-auto px-4 text-center">
            <h2 className="font-serif text-3xl md:text-4xl leading-snug tracking-tight">
              Pas envie de parler à quelqu’un de réel, ou personne autour ? Une
              présence discrète peut suffire — le temps d’un pacte.
            </h2>
            <p className="mt-4 text-sm" style={{ color: 'var(--muted)' }}>
              Ensuite, si besoin, les professionnels et les numéros ci-dessus
              restent la bonne porte.
            </p>
            <Link href="/start" className="btn-primary mt-10 inline-flex">
              Commencer un pacte de présence
            </Link>
          </div>
        </Reveal>
      </section>

      <Footer />
    </main>
  );
}
