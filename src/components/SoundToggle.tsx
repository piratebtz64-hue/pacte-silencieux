'use client';

import { useEffect, useState } from 'react';
import {
  getSoundMode,
  setSoundMode,
  playModeConfirm,
  SOUND_MODE_LABELS,
  SOUND_MODE_HINTS,
  SLEEP_MODES,
  BINAURAL_MODES,
  NATURE_MODES,
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
            className="absolute right-0 z-50 mt-2 w-[17rem] max-h-[78vh] overflow-y-auto rounded-xl border shadow-lg p-1"
            style={{
              borderColor: 'var(--border)',
              background: 'var(--card-solid)',
            }}
          >
            <Section title="Général">
              <ModeRow m="off" active={mode === 'off'} onPick={() => apply('off')} />
              <ModeRow m="ui" active={mode === 'ui'} onPick={() => apply('ui')} />
            </Section>

            <Section title="Nature">
              {NATURE_MODES.map((m) => (
                <ModeRow
                  key={m}
                  m={m}
                  active={mode === m}
                  onPick={() => apply(m)}
                />
              ))}
            </Section>

            <Section title="Pour s’endormir">
              {SLEEP_MODES.filter((m) => !BINAURAL_MODES.includes(m)).map(
                (m) => (
                  <ModeRow
                    key={m}
                    m={m}
                    active={mode === m}
                    onPick={() => apply(m)}
                  />
                )
              )}
            </Section>

            <Section title="Binaural (casque)">
              <p
                className="px-3 pb-1 text-[10px] leading-relaxed"
                style={{ color: 'var(--muted)' }}
              >
                Deux fréquences L/R. Casque conseillé. Indicatif — pas un outil
                médical.
              </p>
              {BINAURAL_MODES.map((m) => (
                <ModeRow
                  key={m}
                  m={m}
                  active={mode === m}
                  onPick={() => apply(m)}
                />
              ))}
            </Section>

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

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p
        className="px-3 pt-2.5 pb-1 text-[10px] uppercase tracking-wide font-semibold border-t first:border-0"
        style={{ color: 'var(--muted)', borderColor: 'var(--border)' }}
      >
        {title}
      </p>
      <ul>{children}</ul>
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
