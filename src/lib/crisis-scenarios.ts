/** Scénarios de crise guidés — pas un remplacement d’urgence médicale */

export type CrisisId =
  | 'panique'
  | 'colere'
  | 'solitude_aigue'
  | 'nuit_noire'
  | 'stress_travail';

export type CrisisStep = {
  title: string;
  body: string;
  action?: string;
};

export type CrisisScenario = {
  id: CrisisId;
  label: string;
  short: string;
  steps: CrisisStep[];
  gestureHint?: string;
  helpline?: string;
};

export const CRISIS_SCENARIOS: CrisisScenario[] = [
  {
    id: 'panique',
    label: 'Vague de panique',
    short: 'Cœur rapide, souffle court, peur sans objet clair',
    helpline: 'Si ça ne redescend pas : 3114',
    gestureHint: 'RESPIRER_ENSEMBLE',
    steps: [
      {
        title: 'Ancrage',
        body: 'Pose les deux pieds au sol. Nomme mentalement : 3 choses que tu vois, 2 que tu touches, 1 que tu entends.',
        action: 'Fais-le 30 secondes',
      },
      {
        title: 'Respiration 4 / 6',
        body: 'Inspire 4 secondes par le nez. Expire 6 secondes par la bouche. Répète 5 fois.',
        action: '5 cycles',
      },
      {
        title: 'Phrase de filet',
        body: '« Cette vague va redescendre. Je suis encore là. »',
      },
      {
        title: 'Lien',
        body: 'Tu peux envoyer le geste « On respire ensemble » à la personne du pacte, sans rien expliquer.',
      },
    ],
  },
  {
    id: 'colere',
    label: 'Colère qui monte',
    short: 'Tension, injustice, envie de tout envoyer',
    gestureHint: 'SANS_PRESSION',
    steps: [
      {
        title: 'Sortir du feu',
        body: 'Écarte-toi 2 minutes de la source (écran, conversation). Bois de l’eau lentement.',
        action: '2 minutes hors du stimulus',
      },
      {
        title: 'Nommer sans agir',
        body: '« Je suis en colère parce que… » — juste nommer, pas encore répondre à la personne concernée.',
      },
      {
        title: 'Décharge physique douce',
        body: 'Serre les poings 5 secondes, relâche. Répète 3 fois. Ou marche 5 minutes.',
      },
      {
        title: 'Lien',
        body: 'Tu peux choisir un message « Colère » dans Soutien, ou un geste « Sans pression ».',
      },
    ],
  },
  {
    id: 'solitude_aigue',
    label: 'Solitude aiguë',
    short: 'Vide, personne joignable, besoin d’un fil',
    gestureHint: 'JE_SUIS_LA',
    steps: [
      {
        title: 'Reconnaître',
        body: 'La solitude peut être là même si tu as des contacts dans le téléphone. Ce n’est pas une faiblesse.',
      },
      {
        title: 'Un contact minimal',
        body: 'Envoie un geste « Je suis là » ou un message Présence. Pas besoin de raconter toute l’histoire.',
      },
      {
        title: 'Corps',
        body: 'Couverture, lumière basse, ou une tasse chaude. Signal au système nerveux : sécurité relative.',
      },
      {
        title: 'Si c’est trop',
        body: '3114 (France) — écoute 24h/24. Ce site reste un complément, pas une urgence.',
      },
    ],
  },
  {
    id: 'nuit_noire',
    label: 'Nuit difficile',
    short: '3h du matin, ruminations, impossible de dormir',
    gestureHint: 'VEILLEE',
    steps: [
      {
        title: 'Sortir du lit mental',
        body: 'Si tu ruminés depuis >20 min, lève-toi 5 min, lumière faible, puis reviens.',
      },
      {
        title: 'Page de dépôt',
        body: 'Écris 3 lignes sur papier (même illisibles) pour “poser” les pensées hors de la tête.',
      },
      {
        title: 'Geste de nuit',
        body: 'Envoie « Petite veillée » ou « Bonne nuit discrète » — présence sans conversation.',
      },
      {
        title: 'Permission',
        body: 'Cette nuit peut être mauvaise. Demain n’est pas encore écrit.',
      },
    ],
  },
  {
    id: 'stress_travail',
    label: 'Surcharge travail',
    short: 'Mails, pression, tête saturée',
    gestureHint: 'UN_PAS',
    steps: [
      {
        title: 'Couper le flux',
        body: 'Ferme les onglets non essentiels. Une seule chose visible à l’écran.',
      },
      {
        title: 'Liste de 3',
        body: 'Écris seulement 3 priorités max pour aujourd’hui / demain. Le reste attend.',
      },
      {
        title: 'Frontière',
        body: 'Choisis une heure de fin symbolique. Après : pas de “juste un mail”.',
      },
      {
        title: 'Lien',
        body: 'Message catégorie Travail / stress, ou geste « Un pas à la fois ».',
      },
    ],
  },
];

export function getCrisis(id: CrisisId): CrisisScenario | undefined {
  return CRISIS_SCENARIOS.find((c) => c.id === id);
}
