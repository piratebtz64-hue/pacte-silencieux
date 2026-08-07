/**
 * Nuances d’intensité — guide produit (communication non verbale & charge émotionnelle)
 *
 * Intensité 1 — LÉGER
 * Contact minimal, faible charge cognitive. Équivalent : hochement, pouce, “je t’ai vu”.
 * Usage : démarrage, fatigue extrême, pas envie de parler.
 *
 * Intensité 2 — MOYEN
 * Engagement clair sans dramatiser. Équivalent : s’asseoir à côté, buste orienté, mains ouvertes.
 * Usage : journée difficile “normale”, besoin de présence structurée.
 *
 * Intensité 3 — PROFOND
 * Charge haute, filet, ancrage. Équivalent : rester stable dans la tempête, respiration guidée.
 * Usage : bord de crise, deuil aigu, panique — toujours avec rappel 3114 / 15 si besoin.
 */

export type IntensityLevel = 1 | 2 | 3;

export const INTENSITY_GUIDE: Record<
  IntensityLevel,
  { label: string; nonVerbal: string; when: string }
> = {
  1: {
    label: 'Léger',
    nonVerbal: 'Hochement, regard bref, présence en périphérie',
    when: 'Micro-lien, salut, pas d’énergie pour plus',
  },
  2: {
    label: 'Moyen',
    nonVerbal: 'Orientation du corps, silence partagé, mains visibles',
    when: 'Soutien classique, journée lourde sans urgence',
  },
  3: {
    label: 'Profond',
    nonVerbal: 'Ancrage au sol, rythme respiratoire, stabilité',
    when: 'Crise, deuil, trop-plein — filet, pas de conseils creux',
  },
};
