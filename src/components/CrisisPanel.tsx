'use client';

import { useState } from 'react';
import {
  CRISIS_SCENARIOS,
  type CrisisId,
  type CrisisScenario,
} from '@/lib/crisis-scenarios';
import { playCrisisStart } from '@/lib/sounds';
import BreathExercise from './BreathExercise';

export default function CrisisPanel({
  onSendGesture,
}: {
  onSendGesture?: (type: string) => void;
}) {
  const [active, setActive] = useState<CrisisScenario | null>(null);
  const [step, setStep] = useState(0);
  const [showBreathOnly, setShowBreathOnly] = useState(false);

  const open = (id: CrisisId) => {
    const s = CRISIS_SCENARIOS.find((c) => c.id === id) || null;
    setActive(s);
    setStep(0);
    setShowBreathOnly(false);
    playCrisisStart();
  };

  if (showBreathOnly) {
    return (
      <div className="card-premium p-5">
        <button
          type="button"
          onClick={() => setShowBreathOnly(false)}
          className="text-xs"
          style={{ color: 'var(--muted)' }}
        >
          ← Retour crise
        </button>
        <h3 className="mt-3 font-serif text-xl tracking-tight text-center">
          Respiration 4 / 6
        </h3>
        <p
          className="mt-2 text-sm text-center leading-relaxed"
          style={{ color: 'var(--muted)' }}
        >
          Suis le cercle. Rien d’autre à faire.
        </p>
        <BreathExercise cycles={5} />
        <p className="mt-6 text-xs text-center" style={{ color: 'var(--muted)' }}>
          Si ça ne redescend pas : 3114 · 15 · 112
        </p>
      </div>
    );
  }

  if (active) {
    const current = active.steps[step];
    const last = step >= active.steps.length - 1;
    const isBreathStep =
      active.id === 'panique' && step === 1;

    return (
      <div
        className="card-premium p-5"
        style={{
          borderColor: 'color-mix(in srgb, var(--accent) 25%, transparent)',
        }}
      >
        <button
          type="button"
          onClick={() => setActive(null)}
          className="text-xs"
          style={{ color: 'var(--muted)' }}
        >
          ← Tous les scénarios
        </button>
        <h3 className="mt-3 font-serif text-xl tracking-tight">{active.label}</h3>
        <p className="mt-1 text-sm" style={{ color: 'var(--muted)' }}>
          Étape {step + 1} / {active.steps.length}
        </p>

        <div className="mt-5">
          <p className="text-sm font-semibold" style={{ color: 'var(--accent)' }}>
            {current.title}
          </p>
          <p className="mt-2 text-sm leading-relaxed">{current.body}</p>
          {current.action && (
            <p
              className="mt-3 text-xs font-bold uppercase tracking-wide"
              style={{ color: 'var(--muted)' }}
            >
              → {current.action}
            </p>
          )}
        </div>

        {isBreathStep && <BreathExercise cycles={5} />}

        <div className="mt-6 flex flex-wrap gap-2">
          {step > 0 && (
            <button
              type="button"
              className="btn-ghost !text-sm"
              onClick={() => setStep((s) => s - 1)}
            >
              Précédent
            </button>
          )}
          {!last ? (
            <button
              type="button"
              className="btn-primary !text-sm"
              onClick={() => setStep((s) => s + 1)}
            >
              Étape suivante
            </button>
          ) : (
            <>
              {active.gestureHint && onSendGesture && (
                <button
                  type="button"
                  className="btn-primary !text-sm"
                  onClick={() => onSendGesture(active.gestureHint!)}
                >
                  Envoyer le geste suggéré
                </button>
              )}
              <button
                type="button"
                className="btn-ghost !text-sm"
                onClick={() => setActive(null)}
              >
                Fermer
              </button>
            </>
          )}
        </div>

        {active.helpline && (
          <p className="mt-5 text-xs" style={{ color: 'var(--muted)' }}>
            {active.helpline}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <p className="text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>
        Scénarios guidés, étape par étape. Ce n’est pas une urgence médicale — en
        détresse aiguë : <strong>3114</strong>.
      </p>

      <button
        type="button"
        onClick={() => setShowBreathOnly(true)}
        className="w-full text-left p-4 rounded-2xl border"
        style={{
          borderColor: 'color-mix(in srgb, var(--accent) 35%, transparent)',
          background: 'var(--accent-soft)',
        }}
      >
        <span className="font-semibold text-sm" style={{ color: 'var(--accent)' }}>
          Respiration guidée 4 / 6
        </span>
        <span className="block text-xs mt-1" style={{ color: 'var(--muted)' }}>
          Cercle animé · 5 cycles · accessible en un tap
        </span>
      </button>

      {CRISIS_SCENARIOS.map((c) => (
        <button
          key={c.id}
          type="button"
          onClick={() => open(c.id)}
          className="w-full text-left p-4 rounded-2xl border transition hover:border-[var(--accent)]"
          style={{ borderColor: 'var(--border)', background: 'var(--card)' }}
        >
          <span className="font-semibold text-sm">{c.label}</span>
          <span className="block text-xs mt-1" style={{ color: 'var(--muted)' }}>
            {c.short}
          </span>
        </button>
      ))}
    </div>
  );
}
