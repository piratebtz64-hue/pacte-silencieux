'use client';

import { useEffect, useState } from 'react';
import {
  getSoundMode,
  setSoundMode,
  playModeConfirm,
  unlockAudio,
  SOUND_MODE_LABELS,
  SOUND_MODE_HINTS,
  SLEEP_MODES,
  BINAURAL_MODES,
  NATURE_MODES,
  type SoundMode,
} from '@/lib/sounds';
import SoundFreqPanel from '@/components/SoundFreqPanel';

function shortLabel(mode: SoundMode): string {
  if (mode === 'off') return 'Muet';
  if (mode === 'ui') return 'Sons';
  return SOUND_MODE_LABELS[mode];
}

export default function SoundToggle({ className = '' }: { className?: string }) {
  const [mode, setMode] = useState<SoundMode>('ui');
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setMode(getSoundMode());
  }, []);

  const openMenu = async () => {
    // Important mobile : débloquer l’audio dans le geste utilisateur
    await unlockAudio();
    setOpen((v) => !v);
  };

  const apply = async (next: SoundMode) => {
    if (busy) return;
    setBusy(true);
    try {
      await unlockAudio();
      setMode(next);
      await setSoundMode(next);
      playModeConfirm();
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className={`relative inline-block ${className}`}>
      <button
        type="button"
        onClick={openMenu}
        className="text-xs font-medium px-3 py-1.5 rounded-full border transition touch-manipulation"
        style={{
          borderColor: 'var(--border)',
          color: mode === 'off' ? 'var(--muted)' : 'var(--accent)',
          background: mode === 'off' ? 'transparent' : 'var(--accent-soft)',
        }}
        title="Choisir le son"
        aria-expanded={open}
      >
        {shortLabel(mode)}
      </button>

      {open && (
        <>
          {/* Overlay : ferme le menu, z-index très haut pour passer au-dessus du fil */}
          <button
            type="button"
            className="fixed inset-0 z-[90] bg-black/40 touch-manipulation"
            aria-label="Fermer le menu son"
            onClick={() => setOpen(false)}
          />

          {/* Sheet bas sur mobile = pas de menu coupé par overflow */}
          <div
            role="dialog"
            aria-label="Menu son"
            className="fixed left-3 right-3 bottom-3 z-[100] max-h-[75vh] overflow-y-auto rounded-2xl border shadow-2xl p-2 sm:absolute sm:left-auto sm:right-0 sm:bottom-auto sm:mt-2 sm:w-[17rem] sm:max-h-[78vh]"
            style={{
              borderColor: 'var(--border)',
              background: 'var(--card-solid)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-2 py-2 sm:hidden">
              <span className="text-sm font-semibold">Sons</span>
              <button
                type="button"
                className="text-xs px-2 py-1"
                style={{ color: 'var(--muted)' }}
                onClick={() => setOpen(false)}
              >
                Fermer
              </button>
            </div>

            <Section title="Général">
              <ModeRow
                m="off"
                active={mode === 'off'}
                onPick={() => apply('off')}
              />
              <ModeRow
                m="ui"
                active={mode === 'ui'}
                onPick={() => apply('ui')}
              />
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
                Casque conseillé. Indicatif — pas un outil médical.
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

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p
        className="px-3 pt-2.5 pb-1 text-[10px] uppercase tracking-wide font-semibold border-t first:border-t-0"
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
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onPick();
        }}
        className="w-full text-left px-3 py-2.5 text-xs touch-manipulation"
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
