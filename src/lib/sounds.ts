/**
 * Sons discrets — Web Audio, sans fichiers externes.
 * Modes UI + ambiances (eau, pluie, sommeil, etc.)
 */

export type SoundMode =
  | 'off'
  | 'ui'
  | 'water'
  | 'rain'
  | 'countryside'
  | 'ocean'
  | 'forest'
  | 'night'
  | 'sleep'
  | 'softnoise';

const STORAGE_KEY = 'pacte_sound_mode';

let ctx: AudioContext | null = null;
let mode: SoundMode = 'ui';
let ambientNodes: AudioNode[] = [];
let ambientActive = false;

function getCtx(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!ctx) {
    try {
      const AC =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      ctx = new AC();
    } catch {
      return null;
    }
  }
  return ctx;
}

async function ensureRunning() {
  const c = getCtx();
  if (!c) return null;
  if (c.state === 'suspended') {
    try {
      await c.resume();
    } catch {
      /* ignore */
    }
  }
  return c;
}

export function getSoundMode(): SoundMode {
  if (typeof window === 'undefined') return 'ui';
  const v = localStorage.getItem(STORAGE_KEY) as SoundMode | null;
  if (v && SOUND_MODE_ORDER.includes(v)) {
    mode = v;
    return v;
  }
  const legacy = localStorage.getItem('pacte_sound');
  if (legacy === '0') {
    mode = 'off';
    return 'off';
  }
  mode = 'ui';
  return 'ui';
}

export function isSoundEnabled(): boolean {
  return getSoundMode() !== 'off';
}

export function setSoundEnabled(on: boolean) {
  setSoundMode(on ? 'ui' : 'off');
}

export async function setSoundMode(next: SoundMode) {
  mode = next;
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, next);
    localStorage.setItem('pacte_sound', next === 'off' ? '0' : '1');
  }
  stopAmbient();
  if (next !== 'off' && next !== 'ui') {
    await startAmbient(next);
  }
}

function uiAllowed() {
  return mode !== 'off';
}

function tone(
  freq: number,
  duration: number,
  type: OscillatorType = 'sine',
  gain = 0.04
) {
  if (!uiAllowed()) return;
  const c = getCtx();
  if (!c) return;
  if (c.state === 'suspended') c.resume().catch(() => {});

  const osc = c.createOscillator();
  const g = c.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  g.gain.value = gain;
  osc.connect(g);
  g.connect(c.destination);
  const now = c.currentTime;
  g.gain.setValueAtTime(gain, now);
  g.gain.exponentialRampToValueAtTime(0.001, now + duration);
  osc.start(now);
  osc.stop(now + duration);
}

export function playSoftChime() {
  tone(523.25, 0.15);
  setTimeout(() => tone(659.25, 0.2), 120);
}

export function playSendClick() {
  tone(440, 0.08, 'triangle', 0.03);
}

export function playBreathIn() {
  tone(220, 0.4, 'sine', 0.025);
}

export function playBreathOut() {
  tone(164.81, 0.5, 'sine', 0.02);
}

export function playCrisisStart() {
  tone(392, 0.2);
  setTimeout(() => tone(311.13, 0.35), 180);
}

export function playModeConfirm() {
  if (mode === 'off') return;
  tone(392, 0.1, 'sine', 0.03);
}

function stopAmbient() {
  ambientNodes.forEach((n) => {
    try {
      if ('stop' in n && typeof (n as OscillatorNode).stop === 'function') {
        (n as OscillatorNode).stop();
      }
      n.disconnect();
    } catch {
      /* ignore */
    }
  });
  ambientNodes = [];
  ambientActive = false;
}

function makeNoiseBuffer(
  c: AudioContext,
  seconds = 4,
  color: 'brown' | 'pink' | 'white' = 'brown'
): AudioBuffer {
  const rate = c.sampleRate;
  const len = rate * seconds;
  const buffer = c.createBuffer(1, len, rate);
  const data = buffer.getChannelData(0);
  let b0 = 0,
    b1 = 0,
    b2 = 0;
  for (let i = 0; i < len; i++) {
    const white = Math.random() * 2 - 1;
    if (color === 'white') {
      data[i] = white * 0.4;
    } else if (color === 'pink') {
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.969 * b2 + white * 0.153852;
      data[i] = (b0 + b1 + b2 + white * 0.1) * 0.15;
    } else {
      b0 = (b0 + 0.02 * white) / 1.02;
      data[i] = b0 * 3.2;
    }
  }
  return buffer;
}

type AmbientKind = Exclude<SoundMode, 'off' | 'ui'>;

async function startAmbient(kind: AmbientKind) {
  const c = await ensureRunning();
  if (!c || ambientActive) return;
  ambientActive = true;

  const master = c.createGain();
  const volumes: Record<AmbientKind, number> = {
    water: 0.028,
    rain: 0.022,
    countryside: 0.02,
    ocean: 0.026,
    forest: 0.018,
    night: 0.016,
    sleep: 0.014,
    softnoise: 0.012,
  };
  master.gain.value = volumes[kind] ?? 0.02;
  master.connect(c.destination);
  ambientNodes.push(master);

  const noise = c.createBufferSource();
  const noiseColor =
    kind === 'softnoise' || kind === 'sleep'
      ? 'pink'
      : kind === 'rain'
        ? 'white'
        : 'brown';
  noise.buffer = makeNoiseBuffer(c, 4, noiseColor);
  noise.loop = true;

  const filter = c.createBiquadFilter();

  switch (kind) {
    case 'water':
      filter.type = 'bandpass';
      filter.frequency.value = 680;
      filter.Q.value = 0.55;
      break;
    case 'rain':
      filter.type = 'lowpass';
      filter.frequency.value = 1400;
      filter.Q.value = 0.35;
      break;
    case 'countryside':
      filter.type = 'lowpass';
      filter.frequency.value = 420;
      filter.Q.value = 0.3;
      break;
    case 'ocean':
      filter.type = 'lowpass';
      filter.frequency.value = 500;
      filter.Q.value = 0.5;
      break;
    case 'forest':
      filter.type = 'bandpass';
      filter.frequency.value = 900;
      filter.Q.value = 0.4;
      break;
    case 'night':
      filter.type = 'lowpass';
      filter.frequency.value = 280;
      filter.Q.value = 0.25;
      break;
    case 'sleep':
      filter.type = 'lowpass';
      filter.frequency.value = 220;
      filter.Q.value = 0.2;
      break;
    case 'softnoise':
      filter.type = 'lowpass';
      filter.frequency.value = 600;
      filter.Q.value = 0.3;
      break;
  }

  noise.connect(filter);
  filter.connect(master);
  noise.start();
  ambientNodes.push(noise, filter);

  // Modulation lente (vagues / respiration de l’ambiance)
  if (kind === 'ocean' || kind === 'water' || kind === 'sleep') {
    const lfo = c.createOscillator();
    const lfoGain = c.createGain();
    lfo.frequency.value = kind === 'ocean' ? 0.08 : kind === 'sleep' ? 0.05 : 0.12;
    lfoGain.gain.value = kind === 'sleep' ? 0.003 : 0.007;
    lfo.connect(lfoGain);
    lfoGain.connect(master.gain);
    lfo.start();
    ambientNodes.push(lfo, lfoGain);
  }

  // Drones graves (campagne, nuit, sommeil)
  if (kind === 'countryside' || kind === 'night' || kind === 'sleep') {
    const drone = c.createOscillator();
    const dg = c.createGain();
    drone.type = 'sine';
    drone.frequency.value = kind === 'sleep' ? 52 : kind === 'night' ? 58 : 65;
    dg.gain.value = kind === 'sleep' ? 0.01 : 0.008;
    drone.connect(dg);
    dg.connect(master);
    drone.start();
    ambientNodes.push(drone, dg);
  }

  // Forêt : second filtre un peu plus aigu (feuillage)
  if (kind === 'forest') {
    const noise2 = c.createBufferSource();
    noise2.buffer = makeNoiseBuffer(c, 3, 'pink');
    noise2.loop = true;
    const f2 = c.createBiquadFilter();
    f2.type = 'highpass';
    f2.frequency.value = 2000;
    const g2 = c.createGain();
    g2.gain.value = 0.35;
    noise2.connect(f2);
    f2.connect(g2);
    g2.connect(master);
    noise2.start();
    ambientNodes.push(noise2, f2, g2);
  }
}

export const SOUND_MODE_LABELS: Record<SoundMode, string> = {
  off: 'Muet',
  ui: 'Sons discrets',
  water: 'Eau douce',
  rain: 'Pluie légère',
  countryside: 'Campagne',
  ocean: 'Vagues',
  forest: 'Forêt',
  night: 'Nuit calme',
  sleep: 'S’endormir',
  softnoise: 'Bruit doux',
};

export const SOUND_MODE_HINTS: Partial<Record<SoundMode, string>> = {
  ui: 'Clics et respiration seulement',
  water: 'Source / ruisseau discret',
  rain: 'Pluie fine en fond',
  countryside: 'Souffle de plaine',
  ocean: 'Respiration de vagues',
  forest: 'Vent dans les feuilles',
  night: 'Calme nocturne',
  sleep: 'Très grave, volume minimal',
  softnoise: 'Bruit rose apaisant',
};

export const SOUND_MODE_ORDER: SoundMode[] = [
  'off',
  'ui',
  'water',
  'rain',
  'ocean',
  'forest',
  'countryside',
  'night',
  'sleep',
  'softnoise',
];

/** Groupe sommeil pour l’UI */
export const SLEEP_MODES: SoundMode[] = ['sleep', 'night', 'softnoise', 'rain'];
