/**
 * Sons discrets — Web Audio, sans fichiers externes.
 *
 * Couleurs de bruit (blanc / rose / brun) : masquage sonore, préférence individuelle.
 * Nature (eau, pluie, vagues…) : literature sur sons naturels et baisse d’anxiété ressentie.
 * Ce n’est pas un traitement du sommeil ni un dispositif médical.
 */

export type SoundMode =
  | 'off'
  | 'ui'
  | 'white'
  | 'pink'
  | 'brown'
  | 'water'
  | 'rain'
  | 'ocean'
  | 'forest'
  | 'countryside'
  | 'night'
  | 'sleep'
  | 'fan';

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
  // Anciens modes
  if (v === ('softnoise' as SoundMode)) {
    mode = 'pink';
    return 'pink';
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

type NoiseColor = 'white' | 'pink' | 'brown';

function makeNoiseBuffer(
  c: AudioContext,
  seconds = 4,
  color: NoiseColor = 'brown'
): AudioBuffer {
  const rate = c.sampleRate;
  const len = rate * seconds;
  const buffer = c.createBuffer(1, len, rate);
  const data = buffer.getChannelData(0);

  // Filtres rose (approximation Paul Kellet)
  let b0 = 0,
    b1 = 0,
    b2 = 0,
    b3 = 0,
    b4 = 0,
    b5 = 0,
    b6 = 0;
  let lastBrown = 0;

  for (let i = 0; i < len; i++) {
    const white = Math.random() * 2 - 1;

    if (color === 'white') {
      data[i] = white * 0.35;
    } else if (color === 'pink') {
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.969 * b2 + white * 0.153852;
      b3 = 0.8665 * b3 + white * 0.3104856;
      b4 = 0.55 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.016898;
      const pink = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
      b6 = white * 0.115926;
      data[i] = pink * 0.11;
    } else {
      // Brun (red) : intégration du blanc
      lastBrown = (lastBrown + 0.02 * white) / 1.02;
      data[i] = lastBrown * 3.5;
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
    white: 0.018,
    pink: 0.016,
    brown: 0.02,
    fan: 0.017,
    water: 0.028,
    rain: 0.022,
    ocean: 0.026,
    forest: 0.018,
    countryside: 0.02,
    night: 0.016,
    sleep: 0.013,
  };
  master.gain.value = volumes[kind] ?? 0.018;
  master.connect(c.destination);
  ambientNodes.push(master);

  const noiseColor: NoiseColor =
    kind === 'white' || kind === 'fan' || kind === 'rain'
      ? 'white'
      : kind === 'pink'
        ? 'pink'
        : kind === 'brown' || kind === 'sleep' || kind === 'night'
          ? 'brown'
          : kind === 'ocean' || kind === 'water'
            ? 'brown'
            : 'pink';

  const noise = c.createBufferSource();
  noise.buffer = makeNoiseBuffer(c, 4, noiseColor);
  noise.loop = true;

  const filter = c.createBiquadFilter();

  switch (kind) {
    case 'white':
      filter.type = 'highshelf';
      filter.frequency.value = 8000;
      filter.gain.value = 0;
      break;
    case 'pink':
      filter.type = 'lowpass';
      filter.frequency.value = 8000;
      filter.Q.value = 0.2;
      break;
    case 'brown':
      filter.type = 'lowpass';
      filter.frequency.value = 900;
      filter.Q.value = 0.25;
      break;
    case 'fan':
      filter.type = 'bandpass';
      filter.frequency.value = 400;
      filter.Q.value = 0.6;
      break;
    case 'water':
      filter.type = 'bandpass';
      filter.frequency.value = 680;
      filter.Q.value = 0.55;
      break;
    case 'rain':
      filter.type = 'lowpass';
      filter.frequency.value = 1500;
      filter.Q.value = 0.35;
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
    case 'countryside':
      filter.type = 'lowpass';
      filter.frequency.value = 420;
      filter.Q.value = 0.3;
      break;
    case 'night':
      filter.type = 'lowpass';
      filter.frequency.value = 280;
      filter.Q.value = 0.25;
      break;
    case 'sleep':
      filter.type = 'lowpass';
      filter.frequency.value = 200;
      filter.Q.value = 0.2;
      break;
  }

  noise.connect(filter);
  filter.connect(master);
  noise.start();
  ambientNodes.push(noise, filter);

  if (kind === 'ocean' || kind === 'water' || kind === 'sleep' || kind === 'fan') {
    const lfo = c.createOscillator();
    const lfoGain = c.createGain();
    lfo.frequency.value =
      kind === 'ocean' ? 0.08 : kind === 'sleep' ? 0.04 : kind === 'fan' ? 0.2 : 0.12;
    lfoGain.gain.value = kind === 'sleep' ? 0.0025 : 0.006;
    lfo.connect(lfoGain);
    lfoGain.connect(master.gain);
    lfo.start();
    ambientNodes.push(lfo, lfoGain);
  }

  if (kind === 'countryside' || kind === 'night' || kind === 'sleep' || kind === 'brown') {
    const drone = c.createOscillator();
    const dg = c.createGain();
    drone.type = 'sine';
    drone.frequency.value = kind === 'sleep' ? 48 : kind === 'night' ? 56 : 62;
    dg.gain.value = kind === 'sleep' ? 0.009 : 0.007;
    drone.connect(dg);
    dg.connect(master);
    drone.start();
    ambientNodes.push(drone, dg);
  }

  if (kind === 'forest') {
    const noise2 = c.createBufferSource();
    noise2.buffer = makeNoiseBuffer(c, 3, 'pink');
    noise2.loop = true;
    const f2 = c.createBiquadFilter();
    f2.type = 'highpass';
    f2.frequency.value = 2000;
    const g2 = c.createGain();
    g2.gain.value = 0.3;
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
  white: 'Bruit blanc',
  pink: 'Bruit rose',
  brown: 'Bruit brun',
  fan: 'Ventilateur',
  water: 'Eau douce',
  rain: 'Pluie légère',
  ocean: 'Vagues',
  forest: 'Forêt',
  countryside: 'Campagne',
  night: 'Nuit calme',
  sleep: 'S’endormir',
};

export const SOUND_MODE_HINTS: Partial<Record<SoundMode, string>> = {
  ui: 'Clics et respiration seulement',
  white: 'Statique égale — masque les bruits aigus',
  pink: 'Plus doux que le blanc — type pluie régulière',
  brown: 'Grave et enveloppant — type tonnerre lointain',
  fan: 'Souffle type ventilateur',
  water: 'Source / ruisseau',
  rain: 'Pluie fine',
  ocean: 'Respiration de vagues',
  forest: 'Vent dans les feuilles',
  countryside: 'Souffle de plaine',
  night: 'Calme nocturne',
  sleep: 'Très grave, volume minimal',
};

export const SOUND_MODE_ORDER: SoundMode[] = [
  'off',
  'ui',
  'white',
  'pink',
  'brown',
  'fan',
  'water',
  'rain',
  'ocean',
  'forest',
  'countryside',
  'night',
  'sleep',
];

export const SOUND_GROUPS: { title: string; modes: SoundMode[] }[] = [
  { title: 'Général', modes: ['off', 'ui'] },
  {
    title: 'Bruits (blanc · rose · brun)',
    modes: ['white', 'pink', 'brown', 'fan'],
  },
  {
    title: 'Nature',
    modes: ['water', 'rain', 'ocean', 'forest', 'countryside'],
  },
  { title: 'Pour s’endormir', modes: ['sleep', 'night', 'brown', 'pink', 'rain'] },
];
