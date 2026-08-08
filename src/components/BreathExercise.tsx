'use client';

import { useEffect, useState, useCallback } from 'react';
import { playBreathIn, playBreathOut } from '@/lib/sounds';

type Phase = 'idle' | 'in' | 'out' | 'done';

/**
 * Respiration guidée 4 inspire / 6 expire — visuelle, low-stimulus.
 * Pas un gadget : ancrage corporel en crise.
 */
export default function BreathExercise({
  cycles = 5,
  onDone,
}: {
  cycles?: number;
  onDone?: () => void;
}) {
  const [phase, setPhase] = useState<Phase>('idle');
  const [cycle, setCycle] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(0);

  const start = useCallback(() => {
    setCycle(0);
    setPhase('in');
    setSecondsLeft(4);
    playBreathIn();
  }, []);

  useEffect(() => {
    if (phase !== 'in' && phase !== 'out') return;

    if (secondsLeft <= 0) {
      if (phase === 'in') {
        setPhase('out');
        setSecondsLeft(6);
        playBreathOut();
        return;
      }
      // fin d’un cycle expire
      const next = cycle + 1;
      if (next >= cycles) {
        setPhase('done');
        onDone?.();
        return;
      }
      setCycle(next);
      setPhase('in');
      setSecondsLeft(4);
      playBreathIn();
      return;
    }

    const t = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [phase, secondsLeft, cycle, cycles, onDone]);

  const scale =
    phase === 'in'
      ? 0.72 + (4 - secondsLeft) * 0.08
      : phase === 'out'
        ? 1.04 - (6 - secondsLeft) * 0.05
        : phase === 'done'
          ? 0.9
          : 0.75;

  const label =
    phase === 'idle'
      ? 'Prêt quand tu l’es'
      : phase === 'in'
        ? 'Inspire…'
        : phase === 'out'
          ? 'Expire…'
          : 'C’est bon. Tu as tenu.';

  return (
    <div className="mt-5 flex flex-col items-center">
      <div
        className="relative flex items-center justify-center"
        style={{ width: 140, height: 140 }}
        aria-live="polite"
      >
        <div
          className="absolute rounded-full"
          style={{
            width: 140,
            height: 140,
            background: 'var(--accent-soft)',
            transform: `scale(${scale})`,
            transition:
              phase === 'in' || phase === 'out'
                ? 'transform 1s linear'
                : 'transform 0.6s ease',
            border: '1px solid color-mix(in srgb, var(--accent) 30%, transparent)',
          }}
        />
        <div className="relative z-10 text-center">
          <p
            className="font-serif text-2xl tabular-nums"
            style={{ color: 'var(--accent)' }}
          >
            {phase === 'idle' || phase === 'done' ? '·' : secondsLeft}
          </p>
          <p className="text-xs mt-1" style={{ color: 'var(--muted)' }}>
            {label}
          </p>
        </div>
      </div>

      <p className="mt-4 text-xs" style={{ color: 'var(--muted)' }}>
        {phase === 'idle'
          ? `${cycles} cycles · inspire 4 s · expire 6 s`
          : phase === 'done'
            ? 'Tu peux recommencer ou passer à l’étape suivante.'
            : `Cycle ${cycle + 1} / ${cycles}`}
      </p>

      {(phase === 'idle' || phase === 'done') && (
        <button
          type="button"
          onClick={start}
          className="btn-primary !text-sm mt-4"
        >
          {phase === 'done' ? 'Recommencer' : 'Lancer la respiration'}
        </button>
      )}
    </div>
  );
}
