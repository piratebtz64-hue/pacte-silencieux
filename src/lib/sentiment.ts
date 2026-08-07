import type { MessageCategory } from './messages';

const KEYWORDS: Record<MessageCategory, string[]> = {
  presence: ['seul', 'seule', 'présence', 'accompagn', 'avec moi', 'invisible', 'personne'],
  difficile: ['difficile', 'lourd', 'lourde', 'dur', 'dure', 'mal', 'galère', 'pénible', 'trop', "n'en peux plus", 'au bout'],
  fatigue: ['fatigué', 'fatiguée', 'épuisé', 'épuisée', 'lasse', 'lassé', 'sommeil', 'dormir', 'crevé', 'crevée', 'épuisement'],
  courage: ['courage', 'force', 'tenir', 'tiens', 'continue', 'bataille', 'combat', 'avancer'],
  gratitude: ['merci', 'reconnaissant', 'reconnaissante', 'gratitude', 'chance', 'reconnaissance'],
  nuit: ['nuit', 'insomnie', 'minuit', 'soir', 'obscur', '3h', '2h', 'réveillé'],
  espoir: ['espoir', 'demain', 'mieux', 'possible', 'avenir', 'lumière'],
  anxiete: ['anxiété', 'angoisse', 'stress', 'peur', 'inquiet', 'inquiète', 'panique', 'anxieux', 'anxieuse', 'stressé'],
  douceur: ['doux', 'douce', 'douceur', 'tendre', 'chaleur', 'réconfort', 'câlin'],
  matin: ['matin', 'réveil', 'journée', 'bonjour', 'réveillé'],
  colere: ['colère', 'énervé', 'énervée', 'furieux', 'furieuse', 'injuste', 'rage', 'énervement'],
  deuil: ['deuil', 'perte', 'manque', 'parti', 'partie', 'chagrin', 'décès', 'absent', 'absente'],
  reconnexion: ['revenir', 'retour', 'reprendre', 'reconnexion', 'reviens', 'de retour'],
  cloture: ['au revoir', 'fin', 'terminer', 'clôturer', 'adieu', 'dernière'],
  remerciement: ['remercie', 'remerciement', 'merci pour', 'gratitude', 'reconnaissant'],
  motivation: [
    'entretien',
    'rendez-vous',
    'rdv',
    'trac',
    'motivation',
    'vas-y',
    'examen',
    'job',
    'embauche',
    'présentation',
  ],
  depart: ['au revoir', 'partir', 'départ', 'adieu', 'clôturer', 'terminer le pacte', 'bonne route'],
  solitude: ['seul', 'seule', 'solitude', 'isolé', 'isolée', 'personne autour', 'vide'],
  fierte: ['fierté', 'fier', 'fière', 'bravo', 'réussi', 'victoire', 'accompli'],
  transition: ['changement', 'déménagement', 'transition', 'nouveau', 'nouvelle vie', 'entre-deux', 'vertige'],
};

export function suggestCategory(text: string): MessageCategory | null {
  const lower = text.toLowerCase();
  let best: MessageCategory | null = null;
  let bestScore = 0;

  for (const [cat, words] of Object.entries(KEYWORDS) as [MessageCategory, string[]][]) {
    let score = 0;
    for (const w of words) {
      if (lower.includes(w)) score += 1;
    }
    if (score > bestScore) {
      bestScore = score;
      best = cat;
    }
  }

  return bestScore > 0 ? best : null;
}

export function detectMoodLabel(text: string): string | null {
  const cat = suggestCategory(text);
  if (!cat) return null;
  const labels: Partial<Record<MessageCategory, string>> = {
    presence: 'Besoin de présence',
    difficile: 'Jour difficile ressenti',
    fatigue: 'Fatigue détectée',
    courage: 'Besoin de courage',
    nuit: 'Nuit / solitude',
    anxiete: 'Anxiété possible',
    colere: 'Colère présente',
    deuil: 'Perte / chagrin',
    espoir: 'Ouverture vers l’espoir',
    douceur: 'Besoin de douceur',
    matin: 'Démarrage de journée',
    reconnexion: 'Envie de reprendre',
    remerciement: 'Envie de remercier',
    motivation: 'Motivation / rendez-vous',
    depart: 'Fin de cycle / départ',
    solitude: 'Solitude ressentie',
    fierte: 'Petite fierté',
    transition: 'Période de changement',
  };
  return labels[cat] || null;
}

export function suggestCategoriesFromText(text: string, limit = 3): MessageCategory[] {
  const lower = text.toLowerCase();
  const scores: { cat: MessageCategory; score: number }[] = [];

  for (const [cat, words] of Object.entries(KEYWORDS) as [MessageCategory, string[]][]) {
    let score = 0;
    for (const w of words) {
      if (lower.includes(w)) score += 1;
    }
    if (score > 0) scores.push({ cat, score });
  }

  return scores
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((s) => s.cat);
}
