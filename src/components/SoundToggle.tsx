'use client';

import { useEffect, useState } from 'react';
import {
  getSoundMode,
  setSoundMode,
  playModeConfirm,
  SOUND_MODE_LABELS,
  SOUND_MODE_HINTS,
  SOUND_GROUPS,
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
            className="absolute right-0 z-50 mt-2 w-[16rem] max-h-[75vh] overflow-y-auto rounded-xl border shadow-lg"
            style={{
              borderColor: 'var(--border)',
              background: 'var(--card-solid)',
            }}
          >
            {SOUND_GROUPS.map((group, gi) => (
              <div key={group.title}>
                <p
                  className={`px-3 pt-2.5 pb-1 text-[10px] uppercase tracking-wide font-semibold ${
                    gi > 0 ? 'border-t' : ''
                  }`}
                  style={{ color: 'var(--muted)', borderColor: 'var(--border)' }}
                >
                  {group.title}
                </p>
                <ul role="listbox" className="pb-1">
                  {group.modes.map((m) => (
                    <li key={`${group.title}-${m}`}>
                      <button
                        type="button"
                        role="option"
                        aria-selected={mode === m}
                        onClick={() => apply(m)}
                        className="w-full text-left px-3 py-2 text-xs transition-opacity hover:opacity-80"
                        style={{
                          color:
                            mode === m ? 'var(--accent)' : 'var(--foreground)',
                          fontWeight: mode === m ? 600 : 400,
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
                  ))}
                </ul>
              </div>
            ))}
            <p
              className="px-3 py-2 text-[10px] leading-relaxed border-t"
              style={{ color: 'var(--muted)', borderColor: 'var(--border)' }}
            >
              Indicatif — pas un traitement du sommeil. Volume volontairement bas.
            </p>
          </div>
        </>
      )}
    </div>
  );
}
