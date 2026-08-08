'use client';

import { useEffect, useState } from 'react';
import {
  type AmbientId,
  type BinauralId,
  AMBIENT_FREQ,
  BINAURAL_FREQ,
  loadFreqOverrides,
  saveFreqOverrides,
  getAmbientConfig,
  getBinauralConfig,
  isAmbientId,
  isBinauralId,
} from '@/lib/sound-config';
import { getSoundMode, reloadAmbientIfNeeded, setSoundMode } from '@/lib/sounds';

export default function SoundFreqPanel() {
  const [open, setOpen] = useState(false);
  const [masterA, setMasterA] = useState(1);
  const [masterB, setMasterB] = useState(1);
  const [filterHz, setFilterHz] = useState(400);
  const [carrier, setCarrier] = useState(100);
  const [beat, setBeat] = useState(4);
  const [mode, setMode] = useState('ui');

  useEffect(() => {
    const m = getSoundMode();
    setMode(m);
    const o = loadFreqOverrides();
    setMasterA(o.masterAmbient ?? 1);
    setMasterB(o.masterBinaural ?? 1);
    if (isAmbientId(m)) setFilterHz(getAmbientConfig(m).filterHz);
    if (isBinauralId(m)) {
      const b = getBinauralConfig(m);
      setCarrier(b.carrierHz);
      setBeat(b.beatHz);
    }
  }, [open]);

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="text-[10px] font-medium underline"
        style={{ color: 'var(--muted)' }}
      >
        Fréquences / volume / binaural
      </button>
    );
  }

  return (
    <div
      className="mt-1 p-3 rounded-xl border text-xs space-y-3"
      style={{ borderColor: 'var(--border)', background: 'var(--background)' }}
    >
      <div className="flex justify-between items-center">
        <span className="font-semibold">Réglage son</span>
        <button type="button" onClick={() => setOpen(false)} style={{ color: 'var(--muted)' }}>
          Fermer
        </button>
      </div>

      <label className="block">
        <span style={{ color: 'var(--muted)' }}>
          Volume nature · {Math.round(masterA * 100)} %
        </span>
        <input
          type="range"
          min={0.4}
          max={1.5}
          step={0.05}
          value={masterA}
          onChange={async (e) => {
            const v = Number(e.target.value);
            setMasterA(v);
            saveFreqOverrides({ masterAmbient: v });
            await reloadAmbientIfNeeded();
          }}
          className="w-full mt-1"
        />
      </label>

      <label className="block">
        <span style={{ color: 'var(--muted)' }}>
          Volume binaural · {Math.round(masterB * 100)} %
        </span>
        <input
          type="range"
          min={0.4}
          max={1.5}
          step={0.05}
          value={masterB}
          onChange={async (e) => {
            const v = Number(e.target.value);
            setMasterB(v);
            saveFreqOverrides({ masterBinaural: v });
            await reloadAmbientIfNeeded();
          }}
          className="w-full mt-1"
        />
      </label>

      {isAmbientId(mode) && (
        <label className="block">
          <span style={{ color: 'var(--muted)' }}>
            Filtre ambiance · {filterHz} Hz
          </span>
          <input
            type="range"
            min={80}
            max={2400}
            step={10}
            value={filterHz}
            onChange={async (e) => {
              const hz = Number(e.target.value);
              setFilterHz(hz);
              saveFreqOverrides({ [mode]: { filterHz: hz } });
              await reloadAmbientIfNeeded();
            }}
            className="w-full mt-1"
          />
        </label>
      )}

      {isBinauralId(mode) && (
        <>
          <label className="block">
            <span style={{ color: 'var(--muted)' }}>
              Porteuse · {carrier} Hz
            </span>
            <input
              type="range"
              min={80}
              max={200}
              step={1}
              value={carrier}
              onChange={async (e) => {
                const v = Number(e.target.value);
                setCarrier(v);
                saveFreqOverrides({ [mode]: { carrierHz: v } });
                await reloadAmbientIfNeeded();
              }}
              className="w-full mt-1"
            />
          </label>
          <label className="block">
            <span style={{ color: 'var(--muted)' }}>
              Battement · {beat} Hz
            </span>
            <input
              type="range"
              min={1}
              max={12}
              step={0.5}
              value={beat}
              onChange={async (e) => {
                const v = Number(e.target.value);
                setBeat(v);
                saveFreqOverrides({ [mode]: { beatHz: v } });
                await reloadAmbientIfNeeded();
              }}
              className="w-full mt-1"
            />
          </label>
        </>
      )}

      <div className="flex flex-wrap gap-1.5">
        {(['sleep', 'water', 'rain', 'ocean'] as AmbientId[]).map((id) => (
          <Chip
            key={id}
            label={id}
            onClick={async () => {
              await setSoundMode(id);
              setMode(id);
              setFilterHz(getAmbientConfig(id).filterHz);
            }}
          />
        ))}
        {(Object.keys(BINAURAL_FREQ) as BinauralId[]).map((id) => (
          <Chip
            key={id}
            label={BINAURAL_FREQ[id].label.replace('Binaural ', '')}
            onClick={async () => {
              await setSoundMode(id);
              setMode(id);
              const b = getBinauralConfig(id);
              setCarrier(b.carrierHz);
              setBeat(b.beatHz);
            }}
          />
        ))}
      </div>

      <button
        type="button"
        onClick={async () => {
          localStorage.removeItem('pacte_sound_freq_overrides');
          setMasterA(1);
          setMasterB(1);
          await reloadAmbientIfNeeded();
        }}
        className="text-[10px] underline"
        style={{ color: 'var(--muted)' }}
      >
        Réinitialiser
      </button>

      <p className="text-[10px] leading-relaxed" style={{ color: 'var(--muted)' }}>
        Binaural : mets un casque. Ce n’est pas un dispositif médical.
      </p>
    </div>
  );
}

function Chip({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="px-2 py-1 rounded-full border text-[10px]"
      style={{ borderColor: 'var(--border)' }}
    >
      {label}
    </button>
  );
}
