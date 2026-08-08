'use client';

import { useEffect, useState } from 'react';
import {
  getSoundMode,
  setSoundMode,
  playModeConfirm,
  SOUND_MODE_LABELS,
  SOUND_MODE_ORDER,
  type SoundMode,
} from '@/lib/sounds';

export default function SoundToggle({ className = '' }: { className?: string }) {
  const [mode, setMode] = useState<SoundMode>('ui');
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setMode(getSoundMode());
  }, []);

  const apply = async (next: SoundMode) => {
    setMode(next);
    await setSoundMode(next);
    playModeConfirm();
    setOpen(false);
  };

  const cycle = async () => {
    const i = SOUND_MODE_ORDER.indexOf(mode);
    const next = SOUND_MODE_ORDER[(i + 1) % SOUND_MODE_ORDER.length];
    await apply(next);
  };

  return (
    <div className={`relative inline-block ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        onContextMenu={(e) => {
          e.preventDefault();
          cycle();
        }}
        className="text-xs font-medium px-3 py-1.5 rounded-full border transition"
        style={{
          borderColor: 'var(--border)',
          color: mode === 'off' ? 'var(--muted)' : 'var(--accent)',
          background: mode === 'off' ? 'transparent' : 'var(--accent-soft)',
        }}
        title="Choisir le son"
        aria-expanded={open}
        aria-haspopup="listbox"
      >
        {mode === 'off' ? 'Muet' : SOUND_MODE_LABELS[mode]}
      </button>

      {open && (
        <>
          <button
            type="button"
            className="fixed inset-0 z-40 cursor-default"
            aria-label="Fermer"
            onClick={() => setOpen(false)}
          />
          <ul
            role="listbox"
            className="absolute right-0 z-50 mt-2 min-w-[11rem] rounded-xl border py-1 shadow-lg"
            style={{
              borderColor: 'var(--border)',
              background: 'var(--card-solid)',
            }}
          >
            {SOUND_MODE_ORDER.map((m) => (
              <li key={m}>
                <button
                  type="button"
                  role="option"
                  aria-selected={mode === m}
                  onClick={() => apply(m)}
                  className="w-full text-left px-3 py-2 text-xs transition-opacity hover:opacity-80"
                  style={{
                    color: mode === m ? 'var(--accent)' : 'var(--foreground)',
                    fontWeight: mode === m ? 600 : 400,
                  }}
                >
                  {SOUND_MODE_LABELS[m]}
                  {m !== 'off' && m !== 'ui' && (
                    <span
                      className="block text-[10px] mt-0.5"
                      style={{ color: 'var(--muted)' }}
                    >
                      Fond sonore très discret
                    </span>
                  )}
                  {m === 'ui' && (
                    <span
                      className="block text-[10px] mt-0.5"
                      style={{ color: 'var(--muted)' }}
                    >
                      Clics et respiration seulement
                    </span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
