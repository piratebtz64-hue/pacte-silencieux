/**
 * Configuration des fréquences sonores (Hz) et volumes.
 * Ajustable sans toucher à la logique Web Audio.
 */

export type AmbientId =
  | 'water'
  | 'rain'
  | 'countryside'
  | 'ocean'
  | 'forest'
  | 'night'
  | 'sleep'
  | 'softnoise';

/** Notes UI (Hz) */
export const UI_FREQ = {
  chimeHigh: 659.25, // E5
  chimeMid: 523.25, // C5
  send: 440, // A4
  breathIn: 220, // A3
  breathOut: 164.81, // E3
  crisisA: 392, // G4
  crisisB: 311.13, // Eb4
  confirm: 392, // G4
} as const;

/** Durées UI (secondes) */
export const UI_DURATION = {
  chime: 0.15,
  chime2: 0.2,
  send: 0.08,
  breathIn: 0.4,
  breathOut: 0.5,
  crisis: 0.2,
  crisis2: 0.35,
  confirm: 0.1,
} as const;

/** Gains UI (0–1, rester bas) */
export const UI_GAIN = {
  chime: 0.04,
  send: 0.03,
  breath: 0.025,
  breathOut: 0.02,
  crisis: 0.035,
  confirm: 0.03,
} as const;

export type AmbientFreqConfig = {
  /** Fréquence centrale du filtre (Hz) */
  filterHz: number;
  /** Résonance Q */
  q: number;
  /** Type de filtre */
  filterType: BiquadFilterType;
  /** Volume master */
  volume: number;
  /** Couleur de bruit */
  noise: 'brown' | 'pink' | 'white';
  /** LFO en Hz (0 = off) */
  lfoHz?: number;
  /** Profondeur LFO sur le gain */
  lfoDepth?: number;
  /** Drone optionnel (Hz) */
  droneHz?: number;
  /** Volume drone */
  droneGain?: number;
  /** Couche aiguë forêt (Hz highpass) */
  highpassHz?: number;
};

/** Profils d’ambiance — fréquences pensées pour rester doux */
export const AMBIENT_FREQ: Record<AmbientId, AmbientFreqConfig> = {
  water: {
    filterHz: 680,
    q: 0.55,
    filterType: 'bandpass',
    volume: 0.028,
    noise: 'brown',
    lfoHz: 0.12,
    lfoDepth: 0.006,
  },
  rain: {
    filterHz: 1400,
    q: 0.35,
    filterType: 'lowpass',
    volume: 0.022,
    noise: 'white',
  },
  countryside: {
    filterHz: 420,
    q: 0.3,
    filterType: 'lowpass',
    volume: 0.02,
    noise: 'brown',
    droneHz: 65,
    droneGain: 0.008,
  },
  ocean: {
    filterHz: 500,
    q: 0.5,
    filterType: 'lowpass',
    volume: 0.026,
    noise: 'brown',
    lfoHz: 0.08,
    lfoDepth: 0.007,
  },
  forest: {
    filterHz: 900,
    q: 0.4,
    filterType: 'bandpass',
    volume: 0.018,
    noise: 'brown',
    highpassHz: 2000,
  },
  night: {
    filterHz: 280,
    q: 0.25,
    filterType: 'lowpass',
    volume: 0.016,
    noise: 'brown',
    droneHz: 58,
    droneGain: 0.008,
  },
  sleep: {
    filterHz: 220,
    q: 0.2,
    filterType: 'lowpass',
    volume: 0.014,
    noise: 'pink',
    lfoHz: 0.05,
    lfoDepth: 0.003,
    droneHz: 52,
    droneGain: 0.01,
  },
  softnoise: {
    filterHz: 600,
    q: 0.3,
    filterType: 'lowpass',
    volume: 0.012,
    noise: 'pink',
  },
};

/**
 * Surcharges utilisateur (localStorage) — ex. { sleep: { filterHz: 180 } }
 * Fusionnées au démarrage d’une ambiance.
 */
const OVERRIDE_KEY = 'pacte_sound_freq_overrides';

export type FreqOverrides = Partial<
  Record<AmbientId, Partial<AmbientFreqConfig>>
> & {
  ui?: Partial<typeof UI_FREQ>;
  masterAmbient?: number; // 0.5–1.5 multiplicateur volume ambiances
};

export function loadFreqOverrides(): FreqOverrides {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(OVERRIDE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as FreqOverrides;
  } catch {
    return {};
  }
}

export function saveFreqOverrides(partial: FreqOverrides) {
  if (typeof window === 'undefined') return;
  const current = loadFreqOverrides();
  const next = { ...current, ...partial };
  localStorage.setItem(OVERRIDE_KEY, JSON.stringify(next));
}

export function getAmbientConfig(id: AmbientId): AmbientFreqConfig {
  const base = AMBIENT_FREQ[id];
  const over = loadFreqOverrides()[id] || {};
  const master = loadFreqOverrides().masterAmbient ?? 1;
  return {
    ...base,
    ...over,
    volume: (over.volume ?? base.volume) * master,
  };
}

export function getUiFreq(key: keyof typeof UI_FREQ): number {
  const over = loadFreqOverrides().ui;
  return over?.[key] ?? UI_FREQ[key];
}
