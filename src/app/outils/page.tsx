'use client';

import { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BreathExercise from '@/components/BreathExercise';
import Grounding54321 from '@/components/Grounding54321';
import MindfulnessMini from '@/components/MindfulnessMini';
import SoundToggle from '@/components/SoundToggle';
import { setSoundMode } from '@/lib/sounds';

type Tool = 'coherence' | 'breath' | 'ground' | 'mind' | 'sleep';

const TOOLS: { id: Tool; title: string; desc: string; featured?: boolean }[] = [
  {
    id: 'coherence',
    title: 'Cohérence cardiaque',
    desc: '5/5 · environ 5 minutes · cercle guidé',
    featured: true,
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
  {
    id: 'sleep',
    title: 'S’endormir',
    desc: 'Ambiance douce + respiration lente 4/6',
  },
];

function resolveTool(raw: string): Tool | null {
  const key = raw.toLowerCase().trim();
  if (key === 'coherence' || key === 'coherence55') return 'coherence';
  if (
    key === 'breath' ||
    key === 'respiration' ||
    key === 'respirations' ||
    key === 'programme'
  )
    return 'breath';
  if (key === 'ground' || key === 'ancrage' || key === '54321') return 'ground';
  if (key === 'mind' || key === 'conscience' || key === 'mindfulness')
    return 'mind';
  if (
    key === 'sleep' ||
    key === 'endormir' ||
    key === 'sommeil' ||
    key === 'nuit'
  )
    return 'sleep';
  return null;
}

function OutilsContent() {
  const search = useSearchParams();
  const [tool, setTool] = useState<Tool | null>(null);

  useEffect(() => {
    const q = search.get('outil') || search.get('tool') || '';
    const hash =
      typeof window !== 'undefined'
        ? window.location.hash.replace('#', '')
        : '';
    const resolved = resolveTool(q || hash);
    setTool(resolved);
    if (resolved === 'sleep') {
      setSoundMode('sleep').catch(() => {});
    }
  }, [search]);

  const open = async (id: Tool) => {
    setTool(id);
    window.history.replaceState(null, '', `/outils?outil=${id}`);
    if (id === 'sleep') {
      await setSoundMode('sleep');
    }
  };

  return (
    <main className="min-h-screen flex flex-col">
      <Header />
      <section className="flex-1 py-10 md:py-14">
        <div className="max-w-lg mx-auto px-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="section-label">Stabilisation</p>
              <h1 className="mt-3 font-serif text-3xl tracking-tight leading-tight">
                Respiration et ancrage
              </h1>
            </div>
            <SoundToggle />
          </div>
          <p
            className="mt-3 text-sm leading-relaxed"
            style={{ color: 'var(--muted)' }}
          >
            Sans pacte. Indicatif — pas des soins médicaux. En détresse : 3114 ·
            15 · 112.
          </p>

          {!tool && (
            <div className="mt-8 space-y-3">
              {TOOLS.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => open(t.id)}
                  className="access-card w-full text-left min-h-[64px] touch-manipulation"
                  style={
                    t.featured
                      ? {
                          borderColor:
                            'color-mix(in srgb, var(--accent) 40%, transparent)',
                          background: 'var(--accent-soft)',
                        }
                      : undefined
                  }
                >
                  <span
                    className="font-semibold text-sm"
                    style={{
                      color: t.featured ? 'var(--accent)' : undefined,
                    }}
                  >
                    {t.title}
                  </span>
                  <span
                    className="block text-xs mt-1.5"
                    style={{ color: 'var(--muted)' }}
                  >
                    {t.desc}
                  </span>
                </button>
              ))}
            </div>
          )}

          {tool && (
            <div className="mt-6 animate-fade-up">
              <div className="flex items-center justify-between gap-2 mb-5">
                <button
                  type="button"
                  onClick={() => {
                    setTool(null);
                    window.history.replaceState(null, '', '/outils');
                  }}
                  className="text-xs font-semibold min-h-[44px]"
                  style={{ color: 'var(--accent)' }}
                >
                  ← Tous les outils
                </button>
                <SoundToggle />
              </div>

              {tool === 'sleep' && (
                <p
                  className="mb-4 text-xs leading-relaxed"
                  style={{ color: 'var(--muted)' }}
                >
                  Ambiance « S’endormir » activée (modifiable via le bouton son).
                </p>
              )}

              {tool === 'coherence' && (
                <BreathExercise
                  initialProtocolId="coherence55"
                  showPicker={false}
                  showHeartRate
                />
              )}
              {tool === 'breath' && (
                <BreathExercise
                  initialProtocolId="exhale46"
                  showPicker
                  showHeartRate
                />
              )}
              {tool === 'sleep' && (
                <BreathExercise
                  initialProtocolId="exhale46"
                  showPicker={false}
                  showHeartRate={false}
                />
              )}
              {tool === 'ground' && <Grounding54321 />}
              {tool === 'mind' && <MindfulnessMini />}
            </div>
          )}

          <div className="mt-12 flex flex-col sm:flex-row gap-3">
            <Link href="/start" className="btn-primary text-center min-h-[48px]">
              Commencer un pacte
            </Link>
            <Link href="/selection" className="btn-ghost text-center min-h-[48px]">
              Sélection
            </Link>
            <Link href="/" className="btn-ghost text-center min-h-[48px]">
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
