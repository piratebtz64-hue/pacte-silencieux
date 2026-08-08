'use client';

import { useState } from 'react';
import {
  CRISIS_SCENARIOS,
  type CrisisId,
  type CrisisScenario,
} from '@/lib/crisis-scenarios';
import { playCrisisStart } from '@/lib/sounds';
import BreathExercise from './BreathExercise';
import Grounding54321 from './Grounding54321';

type Mode = 'menu' | 'breath' | 'ground' | 'scenario';

export default function CrisisPanel({
  onSendGesture,
}: {
  onSendGesture?: (type: string) => void;
}) {
  const [mode, setMode] = useState<Mode>('menu');
  const [active, setActive] = useState<CrisisScenario | null>(null);
  const [step, setStep] = useState(0);

  const openScenario = (id: CrisisId) => {
    const s = CRISIS_SCENARIOS.find((c) => c.id === id) || null;
    setActive(s);
    setStep(0);
    setMode('scenario');
    playCrisisStart();
  };

  if (mode === 'breath') {
    return (
      <div className="card-premium p-5">
        <button
          type="button"
          onClick={() => setMode('menu')}
          className="text-xs"
          style={{ color: 'var(--muted)' }}
        >
          ← Retour
        </button>
        <h3 className="mt-3 font-serif text-xl tracking-tight text-center">
          Respiration guidée
        </h3>
        <p
          className="mt-2 text-sm text-center leading-relaxed max-w-[34ch] mx-auto"
          style={{ color: 'var(--muted)' }}
        >
          Choisis un protocole. Suis le cercle. Ce n’est pas un traitement médical.
        </p>
        <div className="mt-6">
          <BreathExercise showPicker initialProtocolId="exhale46" />
        </div>
        <p className="mt-8 text-xs text-center" style={{ color: 'var(--muted)' }}>
          Détresse aiguë : 3114 · 15 · 112
        </p>
      </div>
    );
  }

  if (mode === 'ground') {
    return (
      <div className="card-premium p-5">
        <button
          type="button"
          onClick={() => setMode('menu')}
          className="text-xs"
          style={{ color: 'var(--muted)' }}
        >
          ← Retour
        </button>
        <h3 className="mt-3 font-serif text-xl tracking-tight text-center">
          Ancrage 5-4-3-2-1
        </h3>
        <p
          className="mt-2 text-sm text-center leading-relaxed max-w-[34ch] mx-auto"
          style={{ color: 'var(--muted)' }}
        >
          Les cinq sens, un par un. Pour revenir dans le présent.
        </p>
        <div className="mt-6">
          <Grounding54321 />
        </div>
        <p className="mt-8 text-xs text-center" style={{ color: 'var(--muted)' }}>
          Détresse aiguë : 3114 · 15 · 112
        </p>
      </div>
    );
  }

  if (mode === 'scenario' && active) {
    const current = active.steps[step];
    const last = step >= active.steps.length - 1;
    const isBreathStep = active.id === 'panique' && step === 1;
    const isGroundStep = active.id === 'panique' && step === 0;

    return (
      <div className="card-premium p-5">
        <button
          type="button"
          onClick={() => {
            setMode('menu');
            setActive(null);
          }}
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

        {isGroundStep && (
          <div className="mt-4">
            <button
              type="button"
              className="btn-ghost !text-sm w-full"
              onClick={() => setMode('ground')}
            >
              Ouvrir l’ancrage 5-4-3-2-1 guidé
            </button>
          </div>
        )}

        {isBreathStep && (
          <div className="mt-4">
            <BreathExercise showPicker={false} initialProtocolId="exhale46" />
          </div>
        )}

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
                onClick={() => {
                  setMode('menu');
                  setActive(null);
                }}
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
        Outils de stabilisation — pas une urgence médicale. En détresse aiguë :{' '}
        <strong>3114</strong> · <strong>15</strong> · <strong>112</strong>.
      </p>

      <button
        type="button"
        onClick={() => setMode('breath')}
        className="w-full text-left p-4 rounded-2xl border"
        style={{
          borderColor: 'color-mix(in srgb, var(--accent) 40%, transparent)',
          background: 'var(--accent-soft)',
        }}
      >
        <span className="font-semibold text-sm" style={{ color: 'var(--accent)' }}>
          Respiration guidée
        </span>
        <span className="block text-xs mt-1" style={{ color: 'var(--muted)' }}>
          4/6 · cohérence 5/5 · carré · soupir · 4-7-8 · cercle animé
        </span>
      </button>

      <button
        type="button"
        onClick={() => setMode('ground')}
        className="w-full text-left p-4 rounded-2xl border"
        style={{
          borderColor: 'color-mix(in srgb, var(--accent) 30%, transparent)',
          background: 'var(--card-solid)',
        }}
      >
        <span className="font-semibold text-sm" style={{ color: 'var(--accent)' }}>
          Ancrage sensoriel 5-4-3-2-1
        </span>
        <span className="block text-xs mt-1" style={{ color: 'var(--muted)' }}>
          Vue · toucher · ouïe · odorat · goût — guidé étape par étape
        </span>
      </button>

      <p
        className="text-[10px] uppercase tracking-[0.12em] font-semibold pt-2"
        style={{ color: 'var(--muted)' }}
      >
        Scénarios
      </p>

      {CRISIS_SCENARIOS.map((c) => (
        <button
          key={c.id}
          type="button"
          onClick={() => openScenario(c.id)}
          className="w-full text-left p-4 rounded-2xl border"
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
