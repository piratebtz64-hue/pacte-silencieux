'use client';

import { useEffect, useState } from 'react';
import {
  type AmbientId,
  AMBIENT_FREQ,
  loadFreqOverrides,
  saveFreqOverrides,
  getAmbientConfig,
} from '@/lib/sound-config';
import { getSoundMode, reloadAmbientIfNeeded, setSoundMode } from '@/lib/sounds';

const AMBIENT_IDS = Object.keys(AMBIENT_FREQ) as AmbientId[];

/**
 * Réglage simple : volume global + fréquence filtre de l’ambiance en cours.
 */
export default function SoundFreqPanel() {
  const [open, setOpen] = useState(false);
  const [master, setMaster] = useState(1);
  const [filterHz, setFilterHz] = useState(400);
  const [mode, setMode] = useState<string>('ui');

  useEffect(() => {
    const m = getSoundMode();
    setMode(m);
    const o = loadFreqOverrides();
    setMaster(o.masterAmbient ?? 1);
    if (m !== 'off' && m !== 'ui' && AMBIENT_IDS.includes(m as AmbientId)) {
      setFilterHz(getAmbientConfig(m as AmbientId).filterHz);
    }
  }, [open]);

  const applyMaster = async (v: number) => {
    setMaster(v);
    saveFreqOverrides({ masterAmbient: v });
    await reloadAmbientIfNeeded();
  };

  const applyFilter = async (hz: number) => {
    setFilterHz(hz);
    const m = getSoundMode();
    if (m === 'off' || m === 'ui') return;
    saveFreqOverrides({
      [m]: { filterHz: hz },
    });
    await reloadAmbientIfNeeded();
  };

  const reset = async () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('pacte_sound_freq_overrides');
    }
    setMaster(1);
    const m = getSoundMode();
    if (m !== 'off' && m !== 'ui') {
      setFilterHz(AMBIENT_FREQ[m as AmbientId].filterHz);
    }
    await reloadAmbientIfNeeded();
  };

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="text-[10px] font-medium underline"
        style={{ color: 'var(--muted)' }}
      >
        Fréquences / volume
      </button>
    );
  }

  const isAmbient = mode !== 'off' && mode !== 'ui';

  return (
    <div
      className="mt-2 p-3 rounded-xl border text-xs space-y-3"
      style={{ borderColor: 'var(--border)', background: 'var(--card-solid)' }}
    >
      <div className="flex justify-between items-center">
        <span className="font-semibold">Réglage son</span>
        <button
          type="button"
          onClick={() => setOpen(false)}
          style={{ color: 'var(--muted)' }}
        >
          Fermer
        </button>
      </div>

      <label className="block">
        <span style={{ color: 'var(--muted)' }}>
          Volume ambiances · {Math.round(master * 100)} %
        </span>
        <input
          type="range"
          min={0.4}
          max={1.4}
          step={0.05}
          value={master}
          onChange={(e) => applyMaster(Number(e.target.value))}
          className="w-full mt-1"
        />
      </label>

      {isAmbient && (
        <label className="block">
          <span style={{ color: 'var(--muted)' }}>
            Fréquence filtre · {filterHz} Hz
          </span>
          <input
            type="range"
            min={80}
            max={2400}
            step={10}
            value={filterHz}
            onChange={(e) => applyFilter(Number(e.target.value))}
            className="w-full mt-1"
          />
          <span className="text-[10px]" style={{ color: 'var(--muted)' }}>
            Plus bas = plus sourd / grave · plus haut = plus clair
          </span>
        </label>
      )}

      {!isAmbient && (
        <p style={{ color: 'var(--muted)' }}>
          Choisis une ambiance (eau, pluie, sommeil…) pour régler sa fréquence.
        </p>
      )}

      <div className="flex flex-wrap gap-2">
        {(['sleep', 'water', 'rain', 'ocean'] as AmbientId[]).map((id) => (
          <button
            key={id}
            type="button"
            onClick={async () => {
              await setSoundMode(id);
              setMode(id);
              setFilterHz(getAmbientConfig(id).filterHz);
            }}
            className="px-2 py-1 rounded-full border text-[10px]"
            style={{ borderColor: 'var(--border)' }}
          >
            {id}
          </button>
        ))}
      </div>

      <button
        type="button"
        onClick={reset}
        className="text-[10px] underline"
        style={{ color: 'var(--muted)' }}
      >
        Réinitialiser les fréquences
      </button>
    </div>
  );
}
