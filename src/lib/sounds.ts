/**
 * Sons — UI, ambiances, binaural (stéréo / casque).
 */

import {
  type AmbientId,
  type BinauralId,
  getAmbientConfig,
  getBinauralConfig,
  getUiFreq,
  isAmbientId,
  isBinauralId,
  UI_DURATION,
  UI_GAIN,
  BINAURAL_FREQ,
} from '@/lib/sound-config';

export type SoundMode = 'off' | 'ui' | AmbientId | BinauralId;

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

/** À appeler dans un geste utilisateur (clic) pour autoriser l’audio mobile */
export async function unlockAudio() {
  const c = await ensureRunning();
  return !!c;
}

export function getSoundMode(): SoundMode {
  if (typeof window === 'undefined') return 'ui';
  const v = localStorage.getItem(STORAGE_KEY) as SoundMode | null;
  if (v && SOUND_MODE_ORDER.includes(v)) {
    mode = v;
    return v;
  }
  if (localStorage.getItem('pacte_sound') === '0') {
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
  if (next === 'off' || next === 'ui') return;
  if (isBinauralId(next)) await startBinaural(next);
  else if (isAmbientId(next)) await startAmbient(next);
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
  tone(getUiFreq('chimeMid'), UI_DURATION.chime, 'sine', UI_GAIN.chime);
  setTimeout(
    () =>
      tone(getUiFreq('chimeHigh'), UI_DURATION.chime2, 'sine', UI_GAIN.chime),
    120
  );
}

export function playSendClick() {
  tone(getUiFreq('send'), UI_DURATION.send, 'triangle', UI_GAIN.send);
}

export function playBreathIn() {
  tone(getUiFreq('breathIn'), UI_DURATION.breathIn, 'sine', UI_GAIN.breath);
}

export function playBreathOut() {
  tone(
    getUiFreq('breathOut'),
    UI_DURATION.breathOut,
    'sine',
    UI_GAIN.breathOut
  );
}

export function playCrisisStart() {
  tone(getUiFreq('crisisA'), UI_DURATION.crisis, 'sine', UI_GAIN.crisis);
  setTimeout(
    () =>
      tone(getUiFreq('crisisB'), UI_DURATION.crisis2, 'sine', UI_GAIN.crisis),
    180
  );
}

export function playModeConfirm() {
  if (mode === 'off') return;
  tone(getUiFreq('confirm'), UI_DURATION.confirm, 'sine', UI_GAIN.confirm);
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

async function startAmbient(kind: AmbientId) {
  const c = await ensureRunning();
  if (!c || ambientActive) return;
  ambientActive = true;

  const cfg = getAmbientConfig(kind);
  const master = c.createGain();
  master.gain.value = cfg.volume;
  master.connect(c.destination);
  ambientNodes.push(master);

  const noise = c.createBufferSource();
  noise.buffer = makeNoiseBuffer(c, 4, cfg.noise);
  noise.loop = true;

  const filter = c.createBiquadFilter();
  filter.type = cfg.filterType;
  filter.frequency.value = cfg.filterHz;
  filter.Q.value = cfg.q;

  noise.connect(filter);
  filter.connect(master);
  noise.start();
  ambientNodes.push(noise, filter);

  if (cfg.lfoHz && cfg.lfoDepth) {
    const lfo = c.createOscillator();
    const lfoGain = c.createGain();
    lfo.frequency.value = cfg.lfoHz;
    lfoGain.gain.value = cfg.lfoDepth;
    lfo.connect(lfoGain);
    lfoGain.connect(master.gain);
    lfo.start();
    ambientNodes.push(lfo, lfoGain);
  }

  if (cfg.droneHz != null) {
    const drone = c.createOscillator();
    const dg = c.createGain();
    drone.type = 'sine';
    drone.frequency.value = cfg.droneHz;
    dg.gain.value = cfg.droneGain ?? 0.008;
    drone.connect(dg);
    dg.connect(master);
    drone.start();
    ambientNodes.push(drone, dg);
  }

  if (cfg.highpassHz != null) {
    const noise2 = c.createBufferSource();
    noise2.buffer = makeNoiseBuffer(c, 3, 'pink');
    noise2.loop = true;
    const f2 = c.createBiquadFilter();
    f2.type = 'highpass';
    f2.frequency.value = cfg.highpassHz;
    const g2 = c.createGain();
    g2.gain.value = 0.35;
    noise2.connect(f2);
    f2.connect(g2);
    g2.connect(master);
    noise2.start();
    ambientNodes.push(noise2, f2, g2);
  }
}

async function startBinaural(id: BinauralId) {
  const c = await ensureRunning();
  if (!c || ambientActive) return;
  ambientActive = true;

  const cfg = getBinauralConfig(id);
  const master = c.createGain();
  master.gain.value = cfg.volume;
  master.connect(c.destination);
  ambientNodes.push(master);

  const merger = c.createChannelMerger(2);
  merger.connect(master);

  const leftOsc = c.createOscillator();
  const rightOsc = c.createOscillator();
  const leftG = c.createGain();
  const rightG = c.createGain();
  leftG.gain.value = 0.5;
  rightG.gain.value = 0.5;

  leftOsc.type = 'sine';
  rightOsc.type = 'sine';
  leftOsc.frequency.value = cfg.carrierHz;
  rightOsc.frequency.value = cfg.carrierHz + cfg.beatHz;

  leftOsc.connect(leftG);
  rightOsc.connect(rightG);
  leftG.connect(merger, 0, 0);
  rightG.connect(merger, 0, 1);

  leftOsc.start();
  rightOsc.start();
  ambientNodes.push(leftOsc, rightOsc, leftG, rightG, merger);

  const noise = c.createBufferSource();
  noise.buffer = makeNoiseBuffer(c, 3, 'pink');
  noise.loop = true;
  const nf = c.createBiquadFilter();
  nf.type = 'lowpass';
  nf.frequency.value = 200;
  const ng = c.createGain();
  ng.gain.value = 0.15;
  noise.connect(nf);
  nf.connect(ng);
  ng.connect(master);
  noise.start();
  ambientNodes.push(noise, nf, ng);
}

export async function reloadAmbientIfNeeded() {
  const m = getSoundMode();
  if (m === 'off' || m === 'ui') return;
  stopAmbient();
  if (isBinauralId(m)) await startBinaural(m);
  else if (isAmbientId(m)) await startAmbient(m);
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
  fire: 'Feu de bois',
  wind: 'Vent doux',
  stream: 'Ruisseau',
  cave: 'Grotte',
  binaural_delta: BINAURAL_FREQ.binaural_delta.label,
  binaural_theta: BINAURAL_FREQ.binaural_theta.label,
  binaural_alpha: BINAURAL_FREQ.binaural_alpha.label,
  binaural_calm: BINAURAL_FREQ.binaural_calm.label,
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
  fire: 'Crépitement doux',
  wind: 'Souffle léger',
  stream: 'Eau vive discrète',
  cave: 'Résonance grave',
  binaural_delta: BINAURAL_FREQ.binaural_delta.hint,
  binaural_theta: BINAURAL_FREQ.binaural_theta.hint,
  binaural_alpha: BINAURAL_FREQ.binaural_alpha.hint,
  binaural_calm: BINAURAL_FREQ.binaural_calm.hint,
};

export const SOUND_MODE_ORDER: SoundMode[] = [
  'off',
  'ui',
  'water',
  'stream',
  'rain',
  'ocean',
  'forest',
  'wind',
  'fire',
  'countryside',
  'cave',
  'night',
  'sleep',
  'softnoise',
  'binaural_calm',
  'binaural_delta',
  'binaural_theta',
  'binaural_alpha',
];

export const SLEEP_MODES: SoundMode[] = [
  'sleep',
  'night',
  'softnoise',
  'rain',
  'cave',
  'binaural_delta',
  'binaural_calm',
];

export const BINAURAL_MODES: SoundMode[] = [
  'binaural_calm',
  'binaural_delta',
  'binaural_theta',
  'binaural_alpha',
];

export const NATURE_MODES: SoundMode[] = [
  'water',
  'stream',
  'rain',
  'ocean',
  'forest',
  'wind',
  'fire',
  'countryside',
  'cave',
];
