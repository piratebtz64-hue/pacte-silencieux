/** Gestes silencieux — signes simples, sans explication */
export const GESTURES = [
  // Présence
  { type: 'JE_SUIS_LA', label: 'Je suis là.', group: 'Présence' },
  { type: 'JE_TIENS', label: 'Je tiens.', group: 'Présence' },
  { type: 'JE_VEILLE_AVEC_TOI', label: 'Je veille un peu avec toi.', group: 'Présence' },
  { type: 'JE_RESTE', label: 'Je reste.', group: 'Présence' },
  { type: 'TU_NES_PAS_SEUL', label: 'Tu n’es pas seul.', group: 'Présence' },
  { type: 'ON_EST_DEUX', label: 'On est deux pour ce moment.', group: 'Présence' },

  // Douceur
  { type: 'AUJOURDHUI_FRAGILE', label: 'Aujourd’hui c’est fragile.', group: 'Douceur' },
  { type: 'DOUCEMENT', label: 'Doucement.', group: 'Douceur' },
  { type: 'RESPIRATION', label: 'Une respiration avec toi.', group: 'Douceur' },
  { type: 'SANS_PRESSION', label: 'Sans pression.', group: 'Douceur' },
  { type: 'C_EST_OK', label: 'C’est ok de ne rien dire.', group: 'Douceur' },

  // Courage
  { type: 'TU_TIENS', label: 'Tu tiens.', group: 'Courage' },
  { type: 'UN_PAS', label: 'Un pas à la fois.', group: 'Courage' },
  { type: 'FORCE_TRANQUILLE', label: 'Force tranquille.', group: 'Courage' },
  { type: 'CONTINUE', label: 'Continue, même petit.', group: 'Courage' },

  // Nuit / silence
  { type: 'BONNE_NUIT', label: 'Bonne nuit discrète.', group: 'Nuit' },
  { type: 'SILENCE_PARTAGE', label: 'Silence partagé.', group: 'Nuit' },
  { type: 'JE_PENSE_A_TOI', label: 'Je pense un peu à toi.', group: 'Nuit' },

  // Clôture légère
  { type: 'MERCI_D_ETRE_LA', label: 'Merci d’être là.', group: 'Lien' },
  { type: 'A_DEMAIN', label: 'À demain, si tu veux.', group: 'Lien' },
] as const;

export type GestureTypeId = (typeof GESTURES)[number]['type'];

export const GESTURE_LABELS: Record<string, string> = Object.fromEntries(
  GESTURES.map((g) => [g.type, g.label])
);

export const GESTURE_GROUPS = ['Présence', 'Douceur', 'Courage', 'Nuit', 'Lien'] as const;
