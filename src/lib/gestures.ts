/** Gestes silencieux — signes simples ou plus longs, sans chat libre */
export const GESTURES = [
  // Salutations
  { type: 'BONJOUR', label: 'Bonjour.', group: 'Salutations' },
  { type: 'BONSOIR', label: 'Bonsoir.', group: 'Salutations' },
  { type: 'SALUT_DISCRET', label: 'Salut discret.', group: 'Salutations' },
  { type: 'COUCOU_DOUX', label: 'Coucou, tout doux.', group: 'Salutations' },
  { type: 'BONJOUR_MATIN', label: 'Bonjour. On démarre sans se précipiter.', group: 'Salutations' },
  { type: 'BONSOIR_REPOS', label: 'Bonsoir. Que la soirée soit plus légère.', group: 'Salutations' },
  { type: 'REBONJOUR', label: 'Rebonjour. Je repasse discrètement.', group: 'Salutations' },
  { type: 'A_PLUS_TARD', label: 'À plus tard, si tu veux.', group: 'Salutations' },
  { type: 'HELLO_SILENCE', label: 'Hello. Rien d’autre pour l’instant.', group: 'Salutations' },
  { type: 'PASSAGE', label: 'Je passe juste dire que je suis là.', group: 'Salutations' },

  // Présence
  { type: 'JE_SUIS_LA', label: 'Je suis là.', group: 'Présence' },
  { type: 'JE_TIENS', label: 'Je tiens.', group: 'Présence' },
  { type: 'JE_VEILLE_AVEC_TOI', label: 'Je veille un peu avec toi.', group: 'Présence' },
  { type: 'JE_RESTE', label: 'Je reste.', group: 'Présence' },
  { type: 'TU_NES_PAS_SEUL', label: 'Tu n’es pas seul.', group: 'Présence' },
  { type: 'ON_EST_DEUX', label: 'On est deux pour ce moment.', group: 'Présence' },
  { type: 'PRESENCE_LONGUE', label: 'Je ne dis rien de plus. Je reste juste un peu de ton côté.', group: 'Présence' },
  { type: 'PRESENCE_DISCRETE', label: 'Présence discrète. Pas besoin de répondre.', group: 'Présence' },
  { type: 'FILET', label: 'Je suis le filet. Tu n’as pas à performer.', group: 'Présence' },
  { type: 'CHECK_IN', label: 'Check-in : toujours là de mon côté.', group: 'Présence' },
  { type: 'A_COTE', label: 'À côté de toi, sans envahir.', group: 'Présence' },

  // Douceur
  { type: 'AUJOURDHUI_FRAGILE', label: 'Aujourd’hui c’est fragile.', group: 'Douceur' },
  { type: 'DOUCEMENT', label: 'Doucement.', group: 'Douceur' },
  { type: 'RESPIRATION', label: 'Une respiration avec toi.', group: 'Douceur' },
  { type: 'SANS_PRESSION', label: 'Sans pression.', group: 'Douceur' },
  { type: 'C_EST_OK', label: 'C’est ok de ne rien dire.', group: 'Douceur' },
  { type: 'DOUCEUR_LONGUE', label: 'Si c’est lourd, tu n’as pas à le porter seul ce soir.', group: 'Douceur' },
  { type: 'TENDRESSE', label: 'Un peu de douceur, sans rien demander en retour.', group: 'Douceur' },
  { type: 'COUVERTURE', label: 'Comme une couverture invisible. Au chaud un instant.', group: 'Douceur' },
  { type: 'PAS_DE_JUGEMENT', label: 'Pas de jugement ici. Juste de la place.', group: 'Douceur' },

  // Courage
  { type: 'TU_TIENS', label: 'Tu tiens.', group: 'Courage' },
  { type: 'UN_PAS', label: 'Un pas à la fois.', group: 'Courage' },
  { type: 'FORCE_TRANQUILLE', label: 'Force tranquille.', group: 'Courage' },
  { type: 'CONTINUE', label: 'Continue, même petit.', group: 'Courage' },
  { type: 'COURAGE_LONG', label: 'Tu n’as pas à être fort tout le temps.', group: 'Courage' },
  { type: 'RALLYE', label: 'Un souffle, puis le suivant. Je suis dans le coin.', group: 'Courage' },
  { type: 'SEUIL', label: 'Jusqu’au seuil. Ensuite on verra.', group: 'Courage' },
  { type: 'BRAVO_DISCRET', label: 'Bravo discret pour avoir tenu jusque-là.', group: 'Courage' },

  // Rituel du soir
  { type: 'BONNE_NUIT', label: 'Bonne nuit discrète.', group: 'Rituel du soir' },
  { type: 'SILENCE_PARTAGE', label: 'Silence partagé.', group: 'Rituel du soir' },
  { type: 'JE_PENSE_A_TOI', label: 'Je pense un peu à toi.', group: 'Rituel du soir' },
  { type: 'LUMIERE_BASSE', label: 'Lumière basse. On pose la journée.', group: 'Rituel du soir' },
  { type: 'FERMER_LA_PORTE', label: 'On ferme doucement la porte sur la journée.', group: 'Rituel du soir' },
  { type: 'THE_IMAGINAIRE', label: 'Un thé imaginaire. Sans parler.', group: 'Rituel du soir' },
  { type: 'RESPIRATION_SOIR', label: 'Trois respirations, puis le repos.', group: 'Rituel du soir' },
  { type: 'VEILLEE', label: 'Petite veillée. Tu peux t’endormir.', group: 'Rituel du soir' },
  { type: 'ETOILE', label: 'Une étoile pour ce soir.', group: 'Rituel du soir' },
  { type: 'REPOS_MERITE', label: 'Le repos est permis. Tu as tenu.', group: 'Rituel du soir' },
  { type: 'NUIT_SANS_EXIGENCE', label: 'Nuit sans exigence. Rien à réussir.', group: 'Rituel du soir' },

  // Matin
  { type: 'BONJOUR_DISCRET', label: 'Bonjour discret. Doucement la journée.', group: 'Matin' },
  { type: 'CAFE_IMAGINAIRE', label: 'Un café imaginaire. Sans précipitation.', group: 'Matin' },
  { type: 'PREMIER_PAS', label: 'Premier pas du jour. Un peu avec toi.', group: 'Matin' },
  { type: 'LEVE_TOI_DOUX', label: 'Quand tu pourras. Pas d’horloge ici.', group: 'Matin' },
  { type: 'NOUVELLE_PAGE', label: 'Nouvelle page. On n’écrit rien de forcé.', group: 'Matin' },

  // Départ
  { type: 'AU_REVOIR', label: 'Au revoir.', group: 'Départ' },
  { type: 'MERCI_ET_ADIEU', label: 'Merci. Et au revoir.', group: 'Départ' },
  { type: 'BONNE_ROUTE', label: 'Bonne route. Présence gardée en mémoire.', group: 'Départ' },
  { type: 'JE_CLOS', label: 'Je clos ce pacte en douceur.', group: 'Départ' },
  { type: 'PAS_UN_ECHEC', label: 'Fin du temps. Ce n’est pas un échec.', group: 'Départ' },
  { type: 'DERNIER_SIGNE', label: 'Dernier signe. Prends soin de toi.', group: 'Départ' },
  { type: 'PORTE_OUVERTE', label: 'Porte ouverte si un jour tu reviens.', group: 'Départ' },

  // Lien
  { type: 'MERCI_D_ETRE_LA', label: 'Merci d’être là.', group: 'Lien' },
  { type: 'A_DEMAIN', label: 'À demain, si tu veux.', group: 'Lien' },
  { type: 'RECU', label: 'Reçu. Juste : reçu.', group: 'Lien' },
  { type: 'POUCE_SILENCIEUX', label: 'Pouce silencieux. Vu, avec toi.', group: 'Lien' },
  { type: 'FIL_TENU', label: 'Le fil est tenu. De mon côté aussi.', group: 'Lien' },
  { type: 'REMERCIEMENT_COURT', label: 'Merci pour ce bout de chemin.', group: 'Lien' },

  // Crise douce
  { type: 'RESPIRER_ENSEMBLE', label: 'On respire ensemble. 4 in, 6 out.', group: 'Crise douce' },
  { type: 'PIEDS_AU_SOL', label: 'Pieds au sol. Tu es ici, maintenant.', group: 'Crise douce' },
  { type: 'PAS_SEUL_DANS_LA_VAGUE', label: 'Pas seul·e dans la vague.', group: 'Crise douce' },
  { type: 'CA_VA_REDESCENDRE', label: 'Ça va redescendre. Je reste.', group: 'Crise douce' },
  { type: 'EAU_LENTE', label: 'Un verre d’eau, lentement. Rien d’autre.', group: 'Crise douce' },

  // Encouragement discret
  { type: 'TU_PEUX_Y_ALLER', label: 'Tu peux y aller. Je reste dans le coin.', group: 'Encouragement' },
  { type: 'APRES_ON_SE_REPOSE', label: 'Après, on se repose. D’abord le pas.', group: 'Encouragement' },
  { type: 'JE_CROIS_EN_TOI_DISCRET', label: 'Je crois en toi — discrètement.', group: 'Encouragement' },
  { type: 'C_EST_DEJA_BEAUCOUP', label: 'Ce que tu fais déjà, c’est beaucoup.', group: 'Encouragement' },
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
  'Départ',
  'Lien',
  'Crise douce',
  'Encouragement',
] as const;
