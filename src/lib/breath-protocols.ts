/**
 * Protocoles respiratoires — littérature clinique / cohérence cardiaque FR / Stanford
 * Ne constituent pas un traitement médical.
 */

export type BreathPhase = 'in' | 'hold' | 'out' | 'hold2' | 'double_in';

export type BreathProtocol = {
  id: string;
  label: string;
  short: string;
  useWhen: string;
  phases: { phase: BreathPhase; seconds: number; hint: string }[];
  cycles: number;
  note?: string;
  /** Affiché en premier dans le sélecteur */
  featured?: boolean;
};

export const BREATH_PROTOCOLS: BreathProtocol[] = [
  {
    id: 'coherence55',
    label: 'Cohérence cardiaque 5 / 5',
    short: 'Inspire 5 · expire 5 · 5 minutes',
    useWhen: 'Protocole de référence FR (3 × 5 min / jour)',
    cycles: 30, // 30 × 10 s = 5 min
    featured: true,
    phases: [
      { phase: 'in', seconds: 5, hint: 'Inspire 5 secondes (nez, ventre)' },
      { phase: 'out', seconds: 5, hint: 'Expire 5 secondes (bouche ou nez)' },
    ],
    note:
      '6 cycles/minute ≈ fréquence de résonance cardiaque. Assis, dos droit si possible.',
  },
  {
    id: 'exhale46',
    label: 'Expire allongée 4 / 6',
    short: 'Inspire 4 · expire 6',
    useWhen: 'Panique, anxiété aiguë — frein vagal',
    cycles: 6,
    phases: [
      { phase: 'in', seconds: 4, hint: 'Inspire par le nez' },
      { phase: 'out', seconds: 6, hint: 'Expire lentement par la bouche' },
    ],
    note: 'L’expire plus long active le parasympathique.',
  },
  {
    id: 'box',
    label: 'Respiration carrée',
    short: '4 · 4 · 4 · 4',
    useWhen: 'Recentrage avant un moment difficile',
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
    useWhen: 'Reset rapide 10–20 s',
    cycles: 3,
    phases: [
      { phase: 'in', seconds: 2, hint: 'Première inspire (nez)' },
      { phase: 'double_in', seconds: 1, hint: 'Petite inspire en plus' },
      { phase: 'out', seconds: 6, hint: 'Longue expire par la bouche' },
    ],
    note: 'Utile en stress immédiat (études type Stanford / Huberman).',
  },
  {
    id: '478',
    label: '4 · 7 · 8',
    short: 'Inspire 4 · retiens 7 · expire 8',
    useWhen: 'Descente, endormissement',
    cycles: 4,
    phases: [
      { phase: 'in', seconds: 4, hint: 'Inspire par le nez' },
      { phase: 'hold', seconds: 7, hint: 'Retiens' },
      { phase: 'out', seconds: 8, hint: 'Expire par la bouche' },
    ],
    note: 'Si malaise : reviens à 4/6 ou cohérence 5/5.',
  },
];

export function getProtocol(id: string) {
  return BREATH_PROTOCOLS.find((p) => p.id === id);
}
