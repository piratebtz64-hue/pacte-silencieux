'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import {
  EMPATHIC_QUESTIONS,
  computeEmpathicResult,
  type EmpathicAnswer,
} from '@/lib/selection-empathique';

type Phase = 'intro' | 'questions' | 'result';

export default function SelectionPage() {
  const [phase, setPhase] = useState<Phase>('intro');
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, EmpathicAnswer>>({});

  const total = EMPATHIC_QUESTIONS.length;
  const current = EMPATHIC_QUESTIONS[step];
  const progress = phase === 'questions' ? (step + 1) / total : phase === 'result' ? 1 : 0;

  const result = useMemo(() => {
    if (phase !== 'result') return null;
    return computeEmpathicResult(answers);
  }, [phase, answers]);

  const choose = (id: EmpathicAnswer) => {
    if (!current) return;
    const next = { ...answers, [current.id]: id };
    setAnswers(next);
    if (step + 1 >= total) {
      setPhase('result');
    } else {
      setStep((s) => s + 1);
    }
  };

  const restart = () => {
    setAnswers({});
    setStep(0);
    setPhase('intro');
  };

  return (
    <main className="min-h-screen flex flex-col">
      <Header showCta={false} />

      <section className="flex-1 py-10 md:py-14">
        <div className="max-w-lg mx-auto px-4 animate-fade-up">
          {/* Barre de progression type Netflix / onboarding */}
          <div
            className="h-1 rounded-full overflow-hidden mb-8"
            style={{ background: 'var(--border)' }}
            role="progressbar"
            aria-valuenow={Math.round(progress * 100)}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <div
              className="h-full rounded-full transition-all duration-500 ease-out"
              style={{
                width: `${Math.max(4, progress * 100)}%`,
                background: 'var(--accent)',
              }}
            />
          </div>

          {phase === 'intro' && (
            <>
              <p className="section-label">Orientation</p>
              <h1 className="mt-3 font-serif text-3xl md:text-[2.15rem] tracking-tight leading-tight">
                Clarifier ce dont tu as besoin
              </h1>
              <p
                className="mt-4 text-sm leading-relaxed"
                style={{ color: 'var(--muted)' }}
              >
                4 questions courtes. Ce n’est <strong>pas</strong> un test
                médical. Aucune bonne ou mauvaise réponse.
              </p>
              <ul
                className="mt-5 text-sm space-y-2 leading-relaxed"
                style={{ color: 'var(--muted)' }}
              >
                <li>· Environ une minute</li>
                <li>· Pour t’orienter vers un pacte ou un outil</li>
                <li>· Tu peux passer et aller directement au pacte</li>
              </ul>
              <div className="mt-10 flex flex-col gap-3">
                <button
                  type="button"
                  onClick={() => setPhase('questions')}
                  className="btn-primary w-full min-h-[48px]"
                >
                  Commencer
                </button>
                <Link
                  href="/start"
                  className="btn-ghost w-full text-center min-h-[48px]"
                >
                  Passer → pacte
                </Link>
                <Link
                  href="/outils"
                  className="text-center text-sm min-h-[44px] grid place-items-center"
                  style={{ color: 'var(--muted)' }}
                >
                  Ou ouvrir les outils
                </Link>
              </div>
            </>
          )}

          {phase === 'questions' && current && (
            <>
              <p className="section-label">
                Question {step + 1} / {total}
              </p>
              <h1 className="mt-3 font-serif text-2xl md:text-3xl tracking-tight leading-snug">
                {current.text}
              </h1>
              {current.hint && (
                <p
                  className="mt-3 text-sm leading-relaxed"
                  style={{ color: 'var(--muted)' }}
                >
                  {current.hint}
                </p>
              )}

              <div className="mt-8 space-y-3">
                {current.options.map((o) => (
                  <button
                    key={o.id}
                    type="button"
                    onClick={() => choose(o.id)}
                    className="access-card w-full text-left text-sm leading-relaxed min-h-[52px] touch-manipulation"
                  >
                    {o.label}
                  </button>
                ))}
              </div>

              <div className="mt-8 flex items-center justify-between gap-3">
                {step > 0 ? (
                  <button
                    type="button"
                    onClick={() => setStep((s) => Math.max(0, s - 1))}
                    className="text-sm min-h-[44px]"
                    style={{ color: 'var(--muted)' }}
                  >
                    ← Précédent
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setPhase('intro')}
                    className="text-sm min-h-[44px]"
                    style={{ color: 'var(--muted)' }}
                  >
                    ← Intro
                  </button>
                )}
                <Link
                  href="/start"
                  className="text-sm min-h-[44px] grid place-items-center"
                  style={{ color: 'var(--accent)' }}
                >
                  Passer
                </Link>
              </div>
            </>
          )}

          {phase === 'result' && result && (
            <div className="animate-fade-up">
              <p className="section-label">Résultat</p>
              <h1 className="mt-3 font-serif text-2xl md:text-3xl tracking-tight leading-snug">
                {result.title}
              </h1>
              <div className="card-premium mt-6 p-6">
                <p className="leading-relaxed text-sm sm:text-base">
                  {result.message}
                </p>
                <p
                  className="mt-4 text-sm leading-relaxed"
                  style={{ color: 'var(--muted)' }}
                >
                  {result.suggestion}
                </p>
              </div>

              <div className="mt-8 flex flex-col gap-3">
                <Link
                  href={result.primaryHref}
                  className="btn-primary text-center min-h-[48px]"
                >
                  {result.primaryLabel}
                </Link>
                <Link
                  href={result.secondaryHref}
                  className="btn-ghost text-center min-h-[48px]"
                >
                  {result.secondaryLabel}
                </Link>
                <button
                  type="button"
                  onClick={restart}
                  className="text-sm min-h-[44px]"
                  style={{ color: 'var(--muted)' }}
                >
                  Recommencer les questions
                </button>
              </div>

              <p
                className="mt-10 text-xs leading-relaxed"
                style={{ color: 'var(--muted)' }}
              >
                En détresse : 3114 · 15 · 112. Ce parcours ne remplace pas une
                aide professionnelle.
              </p>
            </div>
          )}

          <Link
            href="/"
            className="mt-12 inline-block text-sm"
            style={{ color: 'var(--muted)' }}
          >
            ← Accueil
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}
