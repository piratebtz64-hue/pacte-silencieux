/**
 * Protocoles respiratoires — sources : littérature clinique / Stanford / cohérence cardiaque FR
 * Ne constituent pas un traitement médical.
 */

export type BreathPhase = 'in' | 'hold' | 'out' | 'hold2' | 'double_in';

export type BreathProtocol = {
  id: string;
  label: string;
  short: string;
  /** Quand l’utiliser */
  useWhen: string;
  /** Phases d’un cycle, en secondes */
  phases: { phase: BreathPhase; seconds: number; hint: string }[];
  cycles: number;
  note?: string;
};

export const BREATH_PROTOCOLS: BreathProtocol[] = [
  {
    id: 'exhale46',
    label: 'Expire allongée 4 / 6',
    short: 'Inspire 4 · expire 6',
    useWhen: 'Panique, anxiété aiguë — favorise le frein vagal',
    cycles: 6,
    phases: [
      { phase: 'in', seconds: 4, hint: 'Inspire par le nez' },
      { phase: 'out', seconds: 6, hint: 'Expire lentement par la bouche' },
    ],
    note: 'L’expire plus long active le parasympathique.',
  },
  {
    id: 'coherence55',
    label: 'Cohérence cardiaque 5 / 5',
    short: 'Inspire 5 · expire 5',
    useWhen: 'Stress du quotidien — protocole 3×5 min / jour (FR)',
    cycles: 6, // ~1 min ; utilisateur peut relancer
    phases: [
      { phase: 'in', seconds: 5, hint: 'Inspire 5 secondes' },
      { phase: 'out', seconds: 5, hint: 'Expire 5 secondes' },
    ],
    note: '6 cycles/minute ≈ résonance cardiaque moyenne adulte.',
  },
  {
    id: 'box',
    label: 'Respiration carrée',
    short: '4 · 4 · 4 · 4',
    useWhen: 'Tension avant un moment difficile, recentrage',
    cycles: 4,
    phases: [
      { phase: 'in', seconds: 4, hint: 'Inspire' },
      { phase: 'hold', seconds: 4, hint: 'Retiens (épaules relâchées)' },
      { phase: 'out', seconds: 4, hint: 'Expire' },
      { phase: 'hold2', seconds: 4, hint: 'Pause poumons vides' },
    ],
  },
  {
    id: 'sigh',
    label: 'Soupir physiologique',
    short: 'Double inspire + long expire',
    useWhen: 'Reset rapide (10–20 s) — stress immédiat',
    cycles: 3,
    phases: [
      { phase: 'in', seconds: 2, hint: 'Première inspire (nez)' },
      { phase: 'double_in', seconds: 1, hint: 'Petite inspire en plus' },
      { phase: 'out', seconds: 6, hint: 'Longue expire par la bouche' },
    ],
    note: 'Technique étudiée notamment à Stanford (Huberman) pour le stress aigu.',
  },
  {
    id: '478',
    label: '4 · 7 · 8',
    short: 'Inspire 4 · retiens 7 · expire 8',
    useWhen: 'Endormissement, descente en fin de journée',
    cycles: 4,
    phases: [
      { phase: 'in', seconds: 4, hint: 'Inspire par le nez' },
      { phase: 'hold', seconds: 7, hint: 'Retiens' },
      { phase: 'out', seconds: 8, hint: 'Expire par la bouche' },
    ],
    note: 'Ne force pas si tu as un malaise : reviens à 4/6.',
  },
];

export function getProtocol(id: string) {
  return BREATH_PROTOCOLS.find((p) => p.id === id);
}
