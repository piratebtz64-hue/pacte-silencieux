/** Gestes silencieux — signes simples ou un peu plus longs, sans chat libre */
export const GESTURES = [
  // —— Salutations ——
  { type: 'BONJOUR', label: 'Bonjour.', group: 'Salutations' },
  { type: 'BONSOIR', label: 'Bonsoir.', group: 'Salutations' },
  { type: 'SALUT_DISCRET', label: 'Salut discret.', group: 'Salutations' },
  { type: 'COUCOU_DOUX', label: 'Coucou, tout doux.', group: 'Salutations' },
  {
    type: 'BONJOUR_MATIN',
    label: 'Bonjour. On démarre la journée sans se précipiter.',
    group: 'Salutations',
  },
  {
    type: 'BONSOIR_REPOS',
    label: 'Bonsoir. Que la soirée soit plus légère.',
    group: 'Salutations',
  },
  {
    type: 'REBONJOUR',
    label: 'Rebonjour. Je repasse discrètement.',
    group: 'Salutations',
  },
  {
    type: 'A_PLUS_TARD',
    label: 'À plus tard, si tu veux.',
    group: 'Salutations',
  },

  // —— Présence ——
  { type: 'JE_SUIS_LA', label: 'Je suis là.', group: 'Présence' },
  { type: 'JE_TIENS', label: 'Je tiens.', group: 'Présence' },
  { type: 'JE_VEILLE_AVEC_TOI', label: 'Je veille un peu avec toi.', group: 'Présence' },
  { type: 'JE_RESTE', label: 'Je reste.', group: 'Présence' },
  { type: 'TU_NES_PAS_SEUL', label: 'Tu n’es pas seul.', group: 'Présence' },
  { type: 'ON_EST_DEUX', label: 'On est deux pour ce moment.', group: 'Présence' },
  {
    type: 'PRESENCE_LONGUE',
    label: 'Je ne dis rien de plus. Je reste juste un peu de ton côté.',
    group: 'Présence',
  },
  {
    type: 'PRESENCE_DISCRETE',
    label: 'Présence discrète. Pas besoin de répondre.',
    group: 'Présence',
  },

  // —— Douceur ——
  { type: 'AUJOURDHUI_FRAGILE', label: 'Aujourd’hui c’est fragile.', group: 'Douceur' },
  { type: 'DOUCEMENT', label: 'Doucement.', group: 'Douceur' },
  { type: 'RESPIRATION', label: 'Une respiration avec toi.', group: 'Douceur' },
  { type: 'SANS_PRESSION', label: 'Sans pression.', group: 'Douceur' },
  { type: 'C_EST_OK', label: 'C’est ok de ne rien dire.', group: 'Douceur' },
  {
    type: 'DOUCEUR_LONGUE',
    label: 'Si c’est lourd, tu n’as pas à le porter seul ce soir.',
    group: 'Douceur',
  },
  {
    type: 'TENDRESSE',
    label: 'Un peu de douceur de mon côté, sans rien demander en retour.',
    group: 'Douceur',
  },

  // —— Courage ——
  { type: 'TU_TIENS', label: 'Tu tiens.', group: 'Courage' },
  { type: 'UN_PAS', label: 'Un pas à la fois.', group: 'Courage' },
  { type: 'FORCE_TRANQUILLE', label: 'Force tranquille.', group: 'Courage' },
  { type: 'CONTINUE', label: 'Continue, même petit.', group: 'Courage' },
  {
    type: 'COURAGE_LONG',
    label: 'Ce que tu traverses compte. Tu n’as pas à être fort tout le temps.',
    group: 'Courage',
  },
  {
    type: 'RALLYE',
    label: 'Allez. Un souffle, puis le suivant. Je suis dans le coin.',
    group: 'Courage',
  },

  // —— Nuit / rituels du soir ——
  { type: 'BONNE_NUIT', label: 'Bonne nuit discrète.', group: 'Rituel du soir' },
  { type: 'SILENCE_PARTAGE', label: 'Silence partagé.', group: 'Rituel du soir' },
  { type: 'JE_PENSE_A_TOI', label: 'Je pense un peu à toi.', group: 'Rituel du soir' },
  {
    type: 'LUMIERE_BASSE',
    label: 'Lumière basse. On pose la journée.',
    group: 'Rituel du soir',
  },
  {
    type: 'FERMER_LA_PORTE',
    label: 'On ferme doucement la porte sur la journée.',
    group: 'Rituel du soir',
  },
  {
    type: 'THE_IMAGINAIRE',
    label: 'Un thé imaginaire. Sans parler. Juste le soir qui passe.',
    group: 'Rituel du soir',
  },
  {
    type: 'RESPIRATION_SOIR',
    label: 'Trois respirations avec toi, puis le repos.',
    group: 'Rituel du soir',
  },
  {
    type: 'VEILLEE',
    label: 'Petite veillée silencieuse. Tu peux t’endormir, je reste encore un instant.',
    group: 'Rituel du soir',
  },
  {
    type: 'ETOILE',
    label: 'Une étoile pour ce soir. Rien d’autre à faire.',
    group: 'Rituel du soir',
  },
  {
    type: 'REPOS_MERITE',
    label: 'Le repos est permis. Tu as tenu jusqu’ici.',
    group: 'Rituel du soir',
  },

  // —— Matin / démarrage ——
  {
    type: 'BONJOUR_DISCRET',
    label: 'Bonjour discret. La journée peut commencer doucement.',
    group: 'Matin',
  },
  {
    type: 'CAFE_IMAGINAIRE',
    label: 'Un café imaginaire. On démarre sans précipitation.',
    group: 'Matin',
  },
  {
    type: 'PREMIER_PAS',
    label: 'Premier pas du jour. Je suis un peu avec toi.',
    group: 'Matin',
  },

  // —— Lien ——
  { type: 'MERCI_D_ETRE_LA', label: 'Merci d’être là.', group: 'Lien' },
  { type: 'A_DEMAIN', label: 'À demain, si tu veux.', group: 'Lien' },
  {
    type: 'RECU',
    label: 'Reçu. Je ne réponds pas plus long — juste : reçu.',
    group: 'Lien',
  },
  {
    type: 'POUCE_SILENCIEUX',
    label: 'Pouce silencieux. Vu, noté, avec toi.',
    group: 'Lien',
  },
] as const;

export type GestureTypeId = (typeof GESTURES)[number]['type'];

export const GESTURE_LABELS: Record<string, string> = Object.fromEntries(
  GESTURES.map((g) => [g.type, g.label])
);

export const GESTURE_GROUPS = [
  'Salutations',
  'Présence',
  'Douceur',
  'Courage',
  'Rituel du soir',
  'Matin',
  'Lien',
] as const;
