/** Sons discrets — Web Audio, sans fichier externe */

let ctx: AudioContext | null = null;
let enabled = true;

function getCtx(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!ctx) {
    try {
      ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    } catch {
      return null;
    }
  }
  return ctx;
}

export function setSoundEnabled(on: boolean) {
  enabled = on;
  if (typeof window !== 'undefined') {
    localStorage.setItem('pacte_sound', on ? '1' : '0');
  }
}

export function isSoundEnabled(): boolean {
  if (typeof window === 'undefined') return true;
  const v = localStorage.getItem('pacte_sound');
  if (v === null) return true;
  return v === '1';
}

function tone(
  freq: number,
  duration: number,
  type: OscillatorType = 'sine',
  gain = 0.04
) {
  if (!enabled) return;
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

/** Nouveau message reçu */
export function playSoftChime() {
  tone(523.25, 0.15);
  setTimeout(() => tone(659.25, 0.2), 120);
}

/** Message / geste envoyé */
export function playSendClick() {
  tone(440, 0.08, 'triangle', 0.03);
}

/** Respiration guidée (une note douce) */
export function playBreathIn() {
  tone(220, 0.4, 'sine', 0.025);
}

export function playBreathOut() {
  tone(164.81, 0.5, 'sine', 0.02);
}

/** Démarrage scénario crise */
export function playCrisisStart() {
  tone(392, 0.2);
  setTimeout(() => tone(311.13, 0.35), 180);
}
