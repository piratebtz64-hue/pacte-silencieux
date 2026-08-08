'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import {
  BREATH_PROTOCOLS,
  type BreathProtocol,
  type BreathPhase,
} from '@/lib/breath-protocols';
import { playBreathIn, playBreathOut } from '@/lib/sounds';

type RunState = 'idle' | 'run' | 'done';

function scaleForPhase(phase: BreathPhase, progress: number): number {
  // progress 0 → 1 within phase
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
  initialProtocolId = 'exhale46',
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

  const currentPhase = protocol.phases[phaseIndex];

  const start = useCallback(() => {
    const first = protocol.phases[0];
    setCycle(0);
    setPhaseIndex(0);
    setPhaseDuration(first.seconds);
    setSecondsLeft(first.seconds);
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
      // fin de cycle
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

    const t = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
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
              <span className="block text-sm font-semibold">{p.label}</span>
              <span className="block text-xs mt-0.5" style={{ color: 'var(--muted)' }}>
                {p.useWhen}
              </span>
            </button>
          ))}
        </div>
      )}

      <div className="flex flex-col items-center">
        <div
          className="relative flex items-center justify-center"
          style={{ width: 160, height: 160 }}
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
            <p className="text-xs mt-2 leading-snug" style={{ color: 'var(--muted)' }}>
              {state === 'idle'
                ? protocol.short
                : state === 'done'
                  ? 'Terminé. Tu as tenu.'
                  : currentPhase?.hint}
            </p>
          </div>
        </div>

        {state === 'run' && (
          <p className="mt-4 text-xs" style={{ color: 'var(--muted)' }}>
            Cycle {cycle + 1} / {protocol.cycles}
          </p>
        )}

        {protocol.note && state === 'idle' && (
          <p
            className="mt-4 text-xs text-center max-w-[32ch] leading-relaxed"
            style={{ color: 'var(--muted)' }}
          >
            {protocol.note}
          </p>
        )}

        {(state === 'idle' || state === 'done') && (
          <button
            type="button"
            onClick={start}
            className="btn-primary !text-sm mt-5"
          >
            {state === 'done' ? 'Recommencer' : 'Lancer'}
          </button>
        )}

        {state === 'run' && (
          <button
            type="button"
            onClick={() => setState('idle')}
            className="mt-5 text-xs"
            style={{ color: 'var(--muted)' }}
          >
            Arrêter
          </button>
        )}
      </div>
    </div>
  );
}
