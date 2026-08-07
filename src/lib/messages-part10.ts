import type { SupportOpening } from './messages-types';

/**
 * Cohérence cardiaque (guide simple 5 min / 365) +
 * stress au travail : phrases clés, concrètes, utilisables au bureau.
 * Pas un dispositif médical — outil de régulation entre pairs.
 */

const R_CC = [
  'Je le fais. Merci.',
  '5-5, je suis dessus.',
  'Ça aide un peu.',
  'Reçu. Je souffle.',
  'Merci du guide simple.',
];

const R_WORK = [
  'Merci. Je m’ancre.',
  'Reçu. Pause micro.',
  'Ça me recentre.',
  'Je garde la phrase.',
  'Merci d’être là entre deux mails.',
];

export const PART10: SupportOpening[] = [
  // ——— COHÉRENCE CARDIAQUE (guide) ———
  {
    id: 'cc1',
    category: 'anxiete',
    intent: 'offer',
    tone: 'neutre',
    text: 'Cohérence cardiaque simple : inspire 5 secondes, expire 5 secondes, pendant 3 à 5 minutes. Pas besoin d’être parfait sur le rythme. Je peux “battre la mesure” avec toi.',
    responses: R_CC,
  },
  {
    id: 'cc2',
    category: 'anxiete',
    intent: 'offer',
    tone: 'doux',
    text: 'Guide 365 (version courte) : 3 fois par jour si tu peux, 6 respirations par minute (5-5), environ 5 minutes. Au travail : aux toilettes, dans la voiture, avant une réunion.',
    responses: R_CC,
  },
  {
    id: 'cc3',
    category: 'anxiete',
    intent: 'offer',
    tone: 'court',
    text: 'Inspire 5. Expire 5. On recommence.',
    responses: R_CC,
  },
  {
    id: 'cc4',
    category: 'anxiete',
    intent: 'offer',
    tone: 'doux',
    text: 'Si le stress monte au bureau : une seule minute de 5-5 suffit parfois pour redescendre d’un cran. Tu n’as pas à fermer les yeux si ce n’est pas possible.',
    responses: R_CC,
  },
  {
    id: 'cc5',
    category: 'anxiete',
    intent: 'seek',
    tone: 'neutre',
    text: 'Stress qui monte. Tu peux me guider en cohérence cardiaque 5-5 ?',
    responses: [
      'Inspire 5… expire 5… on continue.',
      'Je compte avec toi : 5 et 5.',
      'Une minute ensemble. Souffle régulier.',
      'Pieds au sol, 5-5. Je reste.',
    ],
  },
  {
    id: 'cc6',
    category: 'fatigue',
    intent: 'offer',
    tone: 'neutre',
    text: 'Après un pic de stress : 2 minutes en 5-5, puis un verre d’eau. La fatigue post-tension est normale.',
    responses: R_CC,
  },

  // ——— STRESS AU TRAVAIL — PHRASES CLÉS ———
  {
    id: 'tr1',
    category: 'difficile',
    intent: 'offer',
    tone: 'neutre',
    text: 'Charge de travail trop haute : tu n’as pas à tout absorber en silence. Une chose prioritaire, le reste peut attendre une heure.',
    responses: R_WORK,
  },
  {
    id: 'tr2',
    category: 'anxiete',
    intent: 'offer',
    tone: 'doux',
    text: 'Avant une réunion stressante : 60 secondes de 5-5, épaules vers le bas, une phrase claire en tête. Pas besoin d’être brillant — juste clair.',
    responses: R_WORK,
  },
  {
    id: 'tr3',
    category: 'colere',
    intent: 'offer',
    tone: 'neutre',
    text: 'Mail agressif reçu : ne réponds pas dans la foulée. 5-5, marche jusqu’à la machine à café, puis une réponse factuelle.',
    responses: R_WORK,
  },
  {
    id: 'tr4',
    category: 'fatigue',
    intent: 'offer',
    tone: 'doux',
    text: 'Fin de journée saturée : tu as le droit de fermer l’ordi sans “juste un dernier truc”. La récupération fait partie du travail durable.',
    responses: R_WORK,
  },
  {
    id: 'tr5',
    category: 'motivation',
    intent: 'offer',
    tone: 'energique',
    text: 'Entretien d’embauche ou point avec le N+1 : inspire 5, expire 5, puis entre. Tu peux être stressé et compétent en même temps.',
    responses: R_WORK,
  },
  {
    id: 'tr6',
    category: 'courage',
    intent: 'offer',
    tone: 'neutre',
    text: 'Phrase clé possible : « Je peux livrer A pour vendredi ; B devra glisser. » Poser une limite au travail, ce n’est pas être mauvais — c’est être fiable.',
    responses: R_WORK,
  },
  {
    id: 'tr7',
    category: 'presence',
    intent: 'offer',
    tone: 'court',
    text: 'Pause 5-5. Je suis avec toi entre deux tâches.',
    responses: R_WORK,
  },
  {
    id: 'tr8',
    category: 'difficile',
    intent: 'seek',
    tone: 'neutre',
    text: 'Journée de travail infernale. J’ai besoin d’un ancrage court, pas d’un plan de carrière.',
    responses: [
      'Ancrage : 5-5. Je reste.',
      'Une chose à la fois. Présence ici.',
      'Tu n’as pas à tout résoudre ce soir.',
      'Micro-pause légitime. Je suis là.',
    ],
  },
  {
    id: 'tr9',
    category: 'anxiete',
    intent: 'seek',
    tone: 'doux',
    text: 'Réunion dans 10 minutes, stress au max. Guide-moi 1 minute en 5-5.',
    responses: [
      'Inspire 5… expire 5… encore.',
      'Épaules basses. 5 et 5. Tu peux y aller.',
      'Une minute. Puis tu entres.',
      'Je compte avec toi. Tu n’es pas seul.',
    ],
  },
  {
    id: 'tr10',
    category: 'colere',
    intent: 'seek',
    tone: 'neutre',
    text: 'Mon manager m’a parlé mal. Je bouille au bureau. J’ai besoin de ne pas répondre tout de suite.',
    responses: [
      'Ne réponds pas tout de suite. 5-5 d’abord.',
      'Ta colère est légitime. Pause avant les mots.',
      'Sors 2 minutes si tu peux. Je reste.',
      'Réponse plus tard = plus juste.',
    ],
  },
  {
    id: 'tr11',
    category: 'fatigue',
    intent: 'seek',
    tone: 'doux',
    text: 'Burn-out qui pointe : je n’en peux plus du rythme. J’ai besoin qu’on me dise que freiner n’est pas trahir.',
    responses: [
      'Freiner n’est pas trahir.',
      'Ton corps pose une limite. Elle compte.',
      'Récupérer, c’est sérieux.',
      'Tu as le droit de protéger ton énergie.',
    ],
  },
  {
    id: 'tr12',
    category: 'espoir',
    intent: 'offer',
    tone: 'doux',
    text: 'Une mauvaise journée de travail n’est pas toute ta valeur. Ce soir, une seule chose bien faite suffit comme point d’appui.',
    responses: R_WORK,
  },
  {
    id: 'tr13',
    category: 'matin',
    intent: 'offer',
    tone: 'neutre',
    text: 'Matin de boulot lourd : café, 10 cycles en 5-5, une priorité écrite. Le reste n’existe pas avant 11 h.',
    responses: R_WORK,
  },
  {
    id: 'tr14',
    category: 'cloture',
    intent: 'offer',
    tone: 'doux',
    text: 'Fin de journée : ferme l’onglet mental. Demain reprendra. Ce n’est pas de l’abandon — c’est une frontière saine.',
    responses: R_WORK,
  },
  {
    id: 'tr15',
    category: 'remerciement',
    intent: 'both',
    tone: 'court',
    text: 'Merci pour la pause 5-5. Ça m’a évité de tout envoyer en l’air.',
    responses: R_WORK,
  },
];
