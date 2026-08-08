'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import {
  BREATH_PROTOCOLS,
  type BreathPhase,
} from '@/lib/breath-protocols';
import { playBreathIn, playBreathOut } from '@/lib/sounds';

type RunState = 'idle' | 'run' | 'done';

function scaleForPhase(phase: BreathPhase, progress: number): number {
  switch (phase) {
    case 'in':
    case 'double_in':
      return 0.62 + progress * 0.4;
    case 'out':
      return 1.02 - progress * 0.4;
    case 'hold':
      return 1.02;
    case 'hold2':
      return 0.62;
    default:
      return 0.75;
  }
}

export default function BreathExercise({
  initialProtocolId = 'coherence55',
  showPicker = true,
}: {
  initialProtocolId?: string;
  showPicker?: boolean;
}) {
  const [protocolId, setProtocolId] = useState(initialProtocolId);
  const protocol = useMemo(
    () =>
      BREATH_PROTOCOLS.find((p) => p.id === protocolId) || BREATH_PROTOCOLS[0],
    [protocolId]
  );

  const [state, setState] = useState<RunState>('idle');
  const [cycle, setCycle] = useState(0);
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [phaseDuration, setPhaseDuration] = useState(1);
  const [elapsedSec, setElapsedSec] = useState(0);

  const currentPhase = protocol.phases[phaseIndex];

  const reset = useCallback(() => {
    setState('idle');
    setCycle(0);
    setPhaseIndex(0);
    setSecondsLeft(0);
    setPhaseDuration(1);
    setElapsedSec(0);
  }, []);

  const start = useCallback(() => {
    const first = protocol.phases[0];
    setCycle(0);
    setPhaseIndex(0);
    setPhaseDuration(first.seconds);
    setSecondsLeft(first.seconds);
    setElapsedSec(0);
    setState('run');
    if (first.phase === 'in' || first.phase === 'double_in') playBreathIn();
    else if (first.phase === 'out') playBreathOut();
  }, [protocol]);

  useEffect(() => {
    if (state !== 'run') return;

    if (secondsLeft <= 0) {
      const nextPhase = phaseIndex + 1;
      if (nextPhase < protocol.phases.length) {
        const ph = protocol.phases[nextPhase];
        setPhaseIndex(nextPhase);
        setPhaseDuration(ph.seconds);
        setSecondsLeft(ph.seconds);
        if (ph.phase === 'in' || ph.phase === 'double_in') playBreathIn();
        if (ph.phase === 'out') playBreathOut();
        return;
      }
      const nextCycle = cycle + 1;
      if (nextCycle >= protocol.cycles) {
        setState('done');
        return;
      }
      const ph = protocol.phases[0];
      setCycle(nextCycle);
      setPhaseIndex(0);
      setPhaseDuration(ph.seconds);
      setSecondsLeft(ph.seconds);
      if (ph.phase === 'in' || ph.phase === 'double_in') playBreathIn();
      return;
    }

    const t = setTimeout(() => {
      setSecondsLeft((s) => s - 1);
      setElapsedSec((e) => e + 1);
    }, 1000);
    return () => clearTimeout(t);
  }, [state, secondsLeft, phaseIndex, cycle, protocol]);

  const progress =
    phaseDuration > 0 ? (phaseDuration - secondsLeft) / phaseDuration : 0;
  const scale =
    state === 'run' && currentPhase
      ? scaleForPhase(currentPhase.phase, progress)
      : state === 'done'
        ? 0.85
        : 0.7;

  const totalSec = protocol.cycles * protocol.phases.reduce((a, p) => a + p.seconds, 0);
  const remainSec = Math.max(0, totalSec - elapsedSec);
  const remainMin = Math.floor(remainSec / 60);
  const remainS = remainSec % 60;

  return (
    <div className="w-full">
      {showPicker && state === 'idle' && (
        <div className="space-y-2 mb-6">
          {BREATH_PROTOCOLS.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => setProtocolId(p.id)}
              className="w-full text-left p-3.5 rounded-xl border"
              style={{
                borderColor:
                  protocolId === p.id
                    ? 'color-mix(in srgb, var(--accent) 45%, transparent)'
                    : 'var(--border)',
                background:
                  protocolId === p.id ? 'var(--accent-soft)' : 'var(--card-solid)',
              }}
            >
              <span className="block text-sm font-semibold">
                {p.label}
                {p.featured ? ' · recommandé' : ''}
              </span>
              <span className="block text-xs mt-0.5" style={{ color: 'var(--muted)' }}>
                {p.useWhen}
              </span>
            </button>
          ))}
        </div>
      )}

      <div className="flex flex-col items-center">
        <div className="relative" style={{ width: 168, height: 168 }}>
          <div
            className="absolute inset-0 flex items-center justify-center"
            aria-live="polite"
          >
            <div
              className="absolute rounded-full"
              style={{
                width: 160,
                height: 160,
                background: 'var(--accent-soft)',
                border:
                  '1.5px solid color-mix(in srgb, var(--accent) 35%, transparent)',
                transform: `scale(${scale})`,
                transition:
                  state === 'run'
                    ? `transform ${phaseDuration}s linear`
                    : 'transform 0.5s ease',
              }}
            />
            <div className="relative z-10 text-center px-2">
              <p
                className="font-serif text-3xl tabular-nums leading-none"
                style={{ color: 'var(--accent)' }}
              >
                {state === 'run' ? secondsLeft : '·'}
              </p>
              <p
                className="text-xs mt-2 leading-snug"
                style={{ color: 'var(--muted)' }}
              >
                {state === 'idle'
                  ? protocol.short
                  : state === 'done'
                    ? 'Terminé. Tu as tenu.'
                    : currentPhase?.hint}
              </p>
            </div>
          </div>

          {/* Bouton Reset — toujours accessible près du cercle */}
          <button
            type="button"
            onClick={reset}
            title="Réinitialiser"
            aria-label="Réinitialiser la respiration"
            className="absolute -bottom-1 left-1/2 -translate-x-1/2 z-20 px-3 py-1 rounded-full text-[11px] font-semibold border"
            style={{
              borderColor: 'var(--border)',
              background: 'var(--card-solid)',
              color: 'var(--muted)',
              boxShadow: 'var(--shadow-soft)',
            }}
          >
            Reset
          </button>
        </div>

        {state === 'run' && (
          <div className="mt-8 text-center">
            <p className="text-xs" style={{ color: 'var(--muted)' }}>
              Cycle {cycle + 1} / {protocol.cycles}
              {protocol.id === 'coherence55' && (
                <>
                  {' '}
                  · reste {remainMin}:{String(remainS).padStart(2, '0')}
                </>
              )}
            </p>
          </div>
        )}

        {protocol.note && state === 'idle' && (
          <p
            className="mt-8 text-xs text-center max-w-[34ch] leading-relaxed"
            style={{ color: 'var(--muted)' }}
          >
            {protocol.note}
          </p>
        )}

        {(state === 'idle' || state === 'done') && (
          <button
            type="button"
            onClick={start}
            className="btn-primary !text-sm mt-6"
          >
            {state === 'done' ? 'Recommencer' : 'Lancer'}
          </button>
        )}

        {state === 'run' && (
          <button
            type="button"
            onClick={reset}
            className="mt-5 text-xs font-semibold"
            style={{ color: 'var(--accent)' }}
          >
            Reset — tout remettre à zéro
          </button>
        )}
      </div>
    </div>
  );
}
