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

export default function SelectionPage() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, EmpathicAnswer>>({});

  const done = step >= EMPATHIC_QUESTIONS.length;
  const current = EMPATHIC_QUESTIONS[step];

  const result = useMemo(() => {
    if (!done) return null;
    return computeEmpathicResult(answers);
  }, [done, answers]);

  const choose = (id: EmpathicAnswer) => {
    if (!current) return;
    setAnswers((prev) => ({ ...prev, [current.id]: id }));
    setStep((s) => s + 1);
  };

  const restart = () => {
    setAnswers({});
    setStep(0);
  };

  return (
    <main className="min-h-screen flex flex-col">
      <Header showCta={false} />

      <section className="flex-1 py-12 md:py-16">
        <div className="max-w-lg mx-auto px-4 animate-fade-up">
          <p className="text-xs font-bold uppercase tracking-[0.14em]" style={{ color: 'var(--accent)' }}>
            Sélection empathique
          </p>
          <p className="mt-2 text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>
            Ce n’est pas un test médical. Aucune bonne ou mauvaise réponse — juste
            un moment pour clarifier ce dont tu as besoin.
          </p>

          {!done && current && (
            <>
              <div className="mt-8 flex gap-1.5">
                {EMPATHIC_QUESTIONS.map((_, i) => (
                  <div
                    key={i}
                    className="h-1 flex-1 rounded-full transition-colors"
                    style={{
                      background:
                        i <= step ? 'var(--accent)' : 'var(--border)',
                    }}
                  />
                ))}
              </div>

              <h1 className="mt-8 font-serif text-2xl md:text-3xl tracking-tight leading-snug">
                {current.text}
              </h1>

              <div className="mt-8 space-y-3">
                {current.options.map((o) => (
                  <button
                    key={o.id}
                    type="button"
                    onClick={() => choose(o.id)}
                    className="w-full text-left px-5 py-4 rounded-2xl border text-sm leading-relaxed transition hover:border-[var(--accent)]"
                    style={{
                      borderColor: 'var(--border)',
                      background: 'var(--card)',
                    }}
                  >
                    {o.label}
                  </button>
                ))}
              </div>

              {step > 0 && (
                <button
                  type="button"
                  onClick={() => setStep((s) => Math.max(0, s - 1))}
                  className="mt-6 text-sm"
                  style={{ color: 'var(--muted)' }}
                >
                  ← Question précédente
                </button>
              )}
            </>
          )}

          {done && result && (
            <div className="mt-8">
              <h1 className="font-serif text-2xl md:text-3xl tracking-tight">
                Merci d’avoir pris ce moment
              </h1>
              <div className="card-premium mt-6 p-6">
                <p className="leading-relaxed">{result.message}</p>
                <p className="mt-4 text-sm" style={{ color: 'var(--muted)' }}>
                  {result.suggestion}
                </p>
                {result.toneHint !== 'all' && (
                  <p className="mt-3 text-xs font-medium" style={{ color: 'var(--accent)' }}>
                    Suggestion de ton : {result.toneHint}
                  </p>
                )}
              </div>

              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <Link href="/start" className="btn-primary text-center">
                  Continuer vers un pacte
                </Link>
                <button type="button" onClick={restart} className="btn-ghost">
                  Recommencer
                </button>
              </div>

              <p className="mt-8 text-xs leading-relaxed" style={{ color: 'var(--muted)' }}>
                En détresse ? 3114 (France), 24h/24. Ce parcours ne remplace pas
                une aide professionnelle.
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
