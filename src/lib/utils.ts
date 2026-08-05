import CryptoJS from 'crypto-js';

export function hashEmail(email: string): string {
  return CryptoJS.SHA256(email.toLowerCase().trim()).toString();
}

export function getGestureLabel(type: string): string {
  const map: Record<string, string> = {
    JE_SUIS_LA: 'Je suis là.',
    JE_TIENS: 'Je tiens.',
    AUJOURDHUI_FRAGILE: "Aujourd'hui c'est fragile.",
    JE_VEILLE_AVEC_TOI: 'Je veille un peu avec toi.',
  };
  return map[type] || type;
}

export function getGestureDescription(type: string): string {
  const map: Record<string, string> = {
    JE_SUIS_LA: 'Un battement de présence.',
    JE_TIENS: 'Un signe minuscule.',
    AUJOURDHUI_FRAGILE: "Une manière d'être perçu un peu.",
    JE_VEILLE_AVEC_TOI: 'Un geste tendre, sans rien résoudre.',
  };
  return map[type] || '';
}

export function calculateEndsAt(durationDays: number): Date {
  const ends = new Date();
  ends.setDate(ends.getDate() + durationDays);
  ends.setHours(23, 59, 59, 999);
  return ends;
}

export function getDayNumber(startedAt: Date | null): number {
  if (!startedAt) return 1;
  const now = new Date();
  const diff = now.getTime() - new Date(startedAt).getTime();
  return Math.max(1, Math.floor(diff / (1000 * 60 * 60 * 24)) + 1);
}
