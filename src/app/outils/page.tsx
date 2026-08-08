'use client';

import { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BreathExercise from '@/components/BreathExercise';
import Grounding54321 from '@/components/Grounding54321';
import MindfulnessMini from '@/components/MindfulnessMini';
import HeartRateFeedback from '@/components/HeartRateFeedback';

type Tool = 'coherence' | 'breath' | 'ground' | 'mind';

const TOOLS: { id: Tool; title: string; desc: string }[] = [
  {
    id: 'coherence',
    title: 'Cohérence cardiaque',
    desc: '5/5 · environ 5 minutes · cercle guidé',
  },
  {
    id: 'breath',
    title: 'Respirations',
    desc: '4/6 · carré · soupir physiologique · 4-7-8',
  },
  {
    id: 'ground',
    title: 'Ancrage 5-4-3-2-1',
    desc: 'Revenir dans le corps par les cinq sens',
  },
  {
    id: 'mind',
    title: 'Pleine conscience',
    desc: 'Mini-pratiques courtes, sans performance',
  },
];

function OutilsContent() {
  const search = useSearchParams();
  const [tool, setTool] = useState<Tool | null>(null);

  useEffect(() => {
    const q = (search.get('outil') || search.get('tool') || '').toLowerCase();
    const hash =
      typeof window !== 'undefined'
        ? window.location.hash.replace('#', '').toLowerCase()
        : '';
    const key = (q || hash) as Tool | '';
    if (
      key === 'coherence' ||
      key === 'breath' ||
      key === 'ground' ||
      key === 'mind'
    ) {
      setTool(key);
      return;
    }
    if (key === 'respiration' || key === 'respirations') setTool('breath');
    if (key === 'ancrage') setTool('ground');
    if (key === 'conscience' || key === 'mindfulness') setTool('mind');
  }, [search]);

  return (
    <main className="min-h-screen flex flex-col">
      <Header />
      <section className="flex-1 py-12 md:py-16">
        <div className="max-w-lg mx-auto px-4">
          <p
            className="text-xs font-bold uppercase tracking-[0.14em]"
            style={{ color: 'var(--accent)' }}
          >
            Outils de stabilisation
          </p>
          <h1 className="mt-3 font-serif text-3xl tracking-tight">
            Respiration et ancrage
          </h1>
          <p className="mt-3 text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>
            Accessibles sans pacte. Ce ne sont pas des soins médicaux. En
            détresse aiguë : 3114 · 15 · 112.
          </p>

          {!tool && (
            <div className="mt-8 space-y-3">
              {TOOLS.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => {
                    setTool(t.id);
                    window.history.replaceState(null, '', `/outils?outil=${t.id}`);
                  }}
                  className="w-full text-left p-4 rounded-2xl border"
                  style={{
                    borderColor:
                      t.id === 'coherence'
                        ? 'color-mix(in srgb, var(--accent) 45%, transparent)'
                        : 'var(--border)',
                    background:
                      t.id === 'coherence'
                        ? 'var(--accent-soft)'
                        : 'var(--card-solid)',
                  }}
                >
                  <span
                    className="font-semibold text-sm"
                    style={{
                      color: t.id === 'coherence' ? 'var(--accent)' : undefined,
                    }}
                  >
                    {t.title}
                  </span>
                  <span
                    className="block text-xs mt-1"
                    style={{ color: 'var(--muted)' }}
                  >
                    {t.desc}
                  </span>
                </button>
              ))}
            </div>
          )}

          {tool && (
            <div className="mt-6">
              <button
                type="button"
                onClick={() => {
                  setTool(null);
                  window.history.replaceState(null, '', '/outils');
                }}
                className="text-xs font-semibold mb-4"
                style={{ color: 'var(--accent)' }}
              >
                ← Tous les outils
              </button>

              {tool === 'coherence' && (
                <>
                  <BreathExercise forcedProtocolId="coherence-55" />
                  <HeartRateFeedback />
                </>
              )}
              {tool === 'breath' && <BreathExercise />}
              {tool === 'ground' && <Grounding54321 />}
              {tool === 'mind' && <MindfulnessMini />}
            </div>
          )}

          <div className="mt-12 flex flex-col sm:flex-row gap-3">
            <Link href="/start" className="btn-primary text-center">
              Commencer un pacte
            </Link>
            <Link href="/selection" className="btn-ghost text-center">
              Sélection empathique
            </Link>
            <Link href="/" className="btn-ghost text-center">
              Accueil
            </Link>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}

export default function OutilsPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen grid place-items-center">
          <div className="pact-breath" />
        </main>
      }
    >
      <OutilsContent />
    </Suspense>
  );
}
