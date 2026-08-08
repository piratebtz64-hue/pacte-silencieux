/**
 * Configuration fréquences (Hz) — ambiances, UI, binaural.
 */

export type AmbientId =
  | 'water'
  | 'rain'
  | 'countryside'
  | 'ocean'
  | 'forest'
  | 'night'
  | 'sleep'
  | 'softnoise'
  | 'fire'
  | 'wind'
  | 'stream'
  | 'cave';

export type BinauralId =
  | 'binaural_delta'
  | 'binaural_theta'
  | 'binaural_alpha'
  | 'binaural_calm';

export const UI_FREQ = {
  chimeHigh: 659.25,
  chimeMid: 523.25,
  send: 440,
  breathIn: 220,
  breathOut: 164.81,
  crisisA: 392,
  crisisB: 311.13,
  confirm: 392,
} as const;

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

export const UI_GAIN = {
  chime: 0.04,
  send: 0.03,
  breath: 0.025,
  breathOut: 0.02,
  crisis: 0.035,
  confirm: 0.03,
} as const;

export type AmbientFreqConfig = {
  filterHz: number;
  q: number;
  filterType: BiquadFilterType;
  volume: number;
  noise: 'brown' | 'pink' | 'white';
  lfoHz?: number;
  lfoDepth?: number;
  droneHz?: number;
  droneGain?: number;
  highpassHz?: number;
};

export type BinauralConfig = {
  /** Fréquence porteuse oreille gauche (Hz) */
  carrierHz: number;
  /** Différence droite − gauche = battement perçu (Hz) */
  beatHz: number;
  volume: number;
  label: string;
  hint: string;
};

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
  fire: {
    filterHz: 1100,
    q: 0.6,
    filterType: 'bandpass',
    volume: 0.02,
    noise: 'pink',
    lfoHz: 0.25,
    lfoDepth: 0.005,
  },
  wind: {
    filterHz: 350,
    q: 0.35,
    filterType: 'lowpass',
    volume: 0.019,
    noise: 'brown',
    lfoHz: 0.07,
    lfoDepth: 0.008,
  },
  stream: {
    filterHz: 950,
    q: 0.7,
    filterType: 'bandpass',
    volume: 0.024,
    noise: 'white',
    lfoHz: 0.18,
    lfoDepth: 0.004,
  },
  cave: {
    filterHz: 180,
    q: 0.4,
    filterType: 'lowpass',
    volume: 0.017,
    noise: 'brown',
    droneHz: 48,
    droneGain: 0.012,
  },
};

/** Binaural — casque recommandé. Indicatif, pas un outil médical. */
export const BINAURAL_FREQ: Record<BinauralId, BinauralConfig> = {
  binaural_delta: {
    carrierHz: 100,
    beatHz: 2.5,
    volume: 0.035,
    label: 'Binaural delta',
    hint: '≈ 2,5 Hz · endormissement (casque)',
  },
  binaural_theta: {
    carrierHz: 120,
    beatHz: 6,
    volume: 0.032,
    label: 'Binaural thêta',
    hint: '≈ 6 Hz · détente profonde (casque)',
  },
  binaural_alpha: {
    carrierHz: 140,
    beatHz: 10,
    volume: 0.03,
    label: 'Binaural alpha',
    hint: '≈ 10 Hz · calme éveillé (casque)',
  },
  binaural_calm: {
    carrierHz: 110,
    beatHz: 4,
    volume: 0.033,
    label: 'Binaural doux',
    hint: '≈ 4 Hz · transition calme (casque)',
  },
};

const OVERRIDE_KEY = 'pacte_sound_freq_overrides';

export type FreqOverrides = Partial<
  Record<AmbientId, Partial<AmbientFreqConfig>>
> &
  Partial<Record<BinauralId, Partial<BinauralConfig>>> & {
    ui?: Partial<typeof UI_FREQ>;
    masterAmbient?: number;
    masterBinaural?: number;
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
  localStorage.setItem(
    OVERRIDE_KEY,
    JSON.stringify({ ...current, ...partial })
  );
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

export function getBinauralConfig(id: BinauralId): BinauralConfig {
  const base = BINAURAL_FREQ[id];
  const over = loadFreqOverrides()[id] || {};
  const master = loadFreqOverrides().masterBinaural ?? 1;
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

export function isBinauralId(id: string): id is BinauralId {
  return id in BINAURAL_FREQ;
}

export function isAmbientId(id: string): id is AmbientId {
  return id in AMBIENT_FREQ;
}
