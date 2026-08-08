/**
 * Sons discrets — Web Audio, sans fichiers externes.
 * - Sons UI (envoi, respiration)
 * - Ambiances procédurales très basses (eau, pluie, campagne)
 */

export type SoundMode = 'off' | 'ui' | 'water' | 'rain' | 'countryside';

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
  const v = localStorage.getItem(STORAGE_KEY);
  if (v === 'off' || v === 'ui' || v === 'water' || v === 'rain' || v === 'countryside') {
    mode = v;
    return v;
  }
  // Ancien format pacte_sound
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
  if (next === 'water' || next === 'rain' || next === 'countryside') {
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

/** Petit clic de confirmation quand on change de mode son */
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

function makeNoiseBuffer(c: AudioContext, seconds = 3): AudioBuffer {
  const rate = c.sampleRate;
  const len = rate * seconds;
  const buffer = c.createBuffer(1, len, rate);
  const data = buffer.getChannelData(0);
  let last = 0;
  for (let i = 0; i < len; i++) {
    // Bruit brun approximatif (plus doux que blanc)
    const white = Math.random() * 2 - 1;
    last = (last + 0.02 * white) / 1.02;
    data[i] = last * 3.5;
  }
  return buffer;
}

async function startAmbient(kind: 'water' | 'rain' | 'countryside') {
  const c = await ensureRunning();
  if (!c || ambientActive) return;
  ambientActive = true;

  const master = c.createGain();
  // Très bas — fond sonore, pas un spectacle
  const volume =
    kind === 'water' ? 0.028 : kind === 'rain' ? 0.022 : 0.02;
  master.gain.value = volume;
  master.connect(c.destination);
  ambientNodes.push(master);

  const noise = c.createBufferSource();
  noise.buffer = makeNoiseBuffer(c, 4);
  noise.loop = true;

  const filter = c.createBiquadFilter();
  if (kind === 'water') {
    filter.type = 'bandpass';
    filter.frequency.value = 680;
    filter.Q.value = 0.55;
  } else if (kind === 'rain') {
    filter.type = 'lowpass';
    filter.frequency.value = 1200;
    filter.Q.value = 0.4;
  } else {
    // Campagne : souffle grave + léger filtre
    filter.type = 'lowpass';
    filter.frequency.value = 420;
    filter.Q.value = 0.3;
  }

  noise.connect(filter);
  filter.connect(master);
  noise.start();
  ambientNodes.push(noise, filter);

  // Couche très légère “ruisseau” pour water
  if (kind === 'water') {
    const lfo = c.createOscillator();
    const lfoGain = c.createGain();
    lfo.frequency.value = 0.15;
    lfoGain.gain.value = 0.006;
    lfo.connect(lfoGain);
    lfoGain.connect(master.gain);
    lfo.start();
    ambientNodes.push(lfo, lfoGain);
  }

  // Campagne : drone très bas (presque inaudible)
  if (kind === 'countryside') {
    const drone = c.createOscillator();
    const dg = c.createGain();
    drone.type = 'sine';
    drone.frequency.value = 65;
    dg.gain.value = 0.008;
    drone.connect(dg);
    dg.connect(master);
    drone.start();
    ambientNodes.push(drone, dg);
  }
}

export const SOUND_MODE_LABELS: Record<SoundMode, string> = {
  off: 'Muet',
  ui: 'Sons discrets',
  water: 'Eau douce',
  rain: 'Pluie légère',
  countryside: 'Campagne',
};

export const SOUND_MODE_ORDER: SoundMode[] = [
  'off',
  'ui',
  'water',
  'rain',
  'countryside',
];
