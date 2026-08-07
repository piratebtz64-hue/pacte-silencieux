import type { MessageCategory } from './messages';

const KEYWORDS: Record<MessageCategory, string[]> = {
  presence: ['seul', 'seule', 'présence', 'accompagn', 'avec moi', 'invisible', 'personne'],
  difficile: ['difficile', 'lourd', 'lourde', 'dur', 'dure', 'mal', 'galère', 'pénible', 'trop'],
  fatigue: ['fatigué', 'fatiguée', 'épuisé', 'épuisée', 'crevé', 'crevée', 'épuisement'],
  courage: ['courage', 'force', 'tenir', 'continue', 'avancer'],
  gratitude: ['merci', 'reconnaissant', 'gratitude'],
  nuit: ['nuit', 'insomnie', 'minuit', 'soir', '3h'],
  espoir: ['espoir', 'demain', 'mieux', 'avenir', 'lumière'],
  anxiete: ['anxiété', 'angoisse', 'stress', 'peur', 'inquiet'],
  douceur: ['doux', 'douce', 'douceur', 'tendre', 'réconfort'],
  matin: ['matin', 'réveil', 'journée', 'bonjour'],
  colere: ['colère', 'énervé', 'furieux', 'rage'],
  deuil: ['deuil', 'perte', 'manque', 'chagrin', 'décès'],
  reconnexion: ['revenir', 'retour', 'reprendre', 'reviens'],
  cloture: ['fin', 'terminer', 'clôturer', 'dernière'],
  remerciement: ['remercie', 'remerciement', 'merci pour'],
  motivation: ['entretien', 'rendez-vous', 'trac', 'motivation', 'examen'],
  depart: ['au revoir', 'partir', 'départ', 'adieu', 'bonne route'],
  solitude: ['solitude', 'isolé', 'isolée', 'vide'],
  fierte: ['fierté', 'fier', 'fière', 'bravo', 'réussi'],
  transition: ['changement', 'déménagement', 'transition', 'vertige'],
  travail: ['travail', 'boulot', 'mails', 'réunion', 'collègue'],
  panique: ['panique', 'crise', 'hypervent', 'attaque'],
  famille: ['famille', 'parent', 'mère', 'père', 'proche'],
  salutation: ['bonjour', 'bonsoir', 'salut', 'hello', 'coucou'],
  checkin: ['check-in', 'checkin', 'nouvelles', 'tu es là', 'point'],
  limites: ['limite', 'limites', 'non', 'espace', 'frontière', 'protéger'],
  repos: ['repos', 'pause', 'dormir', 'récupérer', 'rien faire'],
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
    difficile: 'Jour difficile',
    fatigue: 'Fatigue',
    courage: 'Courage',
    nuit: 'Nuit',
    anxiete: 'Anxiété',
    colere: 'Colère',
    deuil: 'Deuil',
    remerciement: 'Remerciement',
    salutation: 'Salutation',
    checkin: 'Prise de nouvelles',
    limites: 'Besoin de limites',
    repos: 'Besoin de repos',
    panique: 'Pic d’angoisse',
    travail: 'Stress travail',
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
