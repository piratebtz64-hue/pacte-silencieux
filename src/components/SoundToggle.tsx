'use client';

import { useEffect, useState } from 'react';
import {
  getSoundMode,
  setSoundMode,
  playModeConfirm,
  SOUND_MODE_LABELS,
  SOUND_MODE_HINTS,
  SOUND_MODE_ORDER,
  SLEEP_MODES,
  type SoundMode,
} from '@/lib/sounds';
import SoundFreqPanel from '@/components/SoundFreqPanel';

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
  };

  return (
    <div className={`relative inline-block ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
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
          <div
            className="absolute right-0 z-50 mt-2 w-[16rem] max-h-[75vh] overflow-y-auto rounded-xl border shadow-lg p-1"
            style={{
              borderColor: 'var(--border)',
              background: 'var(--card-solid)',
            }}
          >
            <p
              className="px-3 pt-2.5 pb-1 text-[10px] uppercase tracking-wide font-semibold"
              style={{ color: 'var(--muted)' }}
            >
              Général
            </p>
            <ul role="listbox">
              {SOUND_MODE_ORDER.filter(
                (m) => m === 'off' || m === 'ui' || !SLEEP_MODES.includes(m)
              ).map((m) => (
                <ModeRow
                  key={m}
                  m={m}
                  active={mode === m}
                  onPick={() => apply(m)}
                />
              ))}
            </ul>
            <p
              className="px-3 pt-2 pb-1 text-[10px] uppercase tracking-wide font-semibold border-t"
              style={{ color: 'var(--muted)', borderColor: 'var(--border)' }}
            >
              Pour s’endormir
            </p>
            <ul role="listbox" className="pb-1">
              {SLEEP_MODES.map((m) => (
                <ModeRow
                  key={m}
                  m={m}
                  active={mode === m}
                  onPick={() => apply(m)}
                />
              ))}
            </ul>
            <div
              className="px-2 pb-2 pt-1 border-t"
              style={{ borderColor: 'var(--border)' }}
            >
              <SoundFreqPanel />
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function ModeRow({
  m,
  active,
  onPick,
}: {
  m: SoundMode;
  active: boolean;
  onPick: () => void;
}) {
  return (
    <li>
      <button
        type="button"
        role="option"
        aria-selected={active}
        onClick={onPick}
        className="w-full text-left px-3 py-2 text-xs transition-opacity hover:opacity-80"
        style={{
          color: active ? 'var(--accent)' : 'var(--foreground)',
          fontWeight: active ? 600 : 400,
        }}
      >
        {SOUND_MODE_LABELS[m]}
        {SOUND_MODE_HINTS[m] && (
          <span
            className="block text-[10px] mt-0.5"
            style={{ color: 'var(--muted)' }}
          >
            {SOUND_MODE_HINTS[m]}
          </span>
        )}
      </button>
    </li>
  );
}
