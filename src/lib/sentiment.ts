import type { MessageCategory } from './messages';

const KEYWORDS: Record<MessageCategory, string[]> = {
  presence: ['seul', 'seule', 'présence', 'accompagn', 'invisible'],
  difficile: ['difficile', 'lourd', 'dur', 'galère', 'pénible'],
  fatigue: ['fatigué', 'épuisé', 'crevé', 'épuisement'],
  courage: ['courage', 'force', 'tenir', 'avancer'],
  gratitude: ['merci', 'reconnaissant', 'gratitude'],
  nuit: ['nuit', 'insomnie', 'minuit', 'soir'],
  espoir: ['espoir', 'demain', 'mieux', 'lumière'],
  anxiete: ['anxiété', 'angoisse', 'stress', 'peur'],
  douceur: ['doux', 'douceur', 'tendre', 'réconfort'],
  matin: ['matin', 'réveil', 'bonjour'],
  colere: ['colère', 'énervé', 'rage'],
  deuil: ['deuil', 'perte', 'manque', 'chagrin'],
  reconnexion: ['revenir', 'retour', 'reprendre'],
  cloture: ['fin', 'clôturer', 'dernière'],
  remerciement: ['remercie', 'remerciement'],
  motivation: ['entretien', 'rendez-vous', 'trac', 'motivation'],
  depart: ['au revoir', 'départ', 'adieu'],
  solitude: ['solitude', 'isolé', 'vide'],
  fierte: ['fierté', 'bravo', 'réussi'],
  transition: ['changement', 'transition', 'vertige'],
  travail: ['travail', 'boulot', 'mails', 'réunion'],
  panique: ['panique', 'crise', 'attaque'],
  famille: ['famille', 'parent', 'proche'],
  salutation: ['bonjour', 'bonsoir', 'salut', 'hello'],
  checkin: ['check-in', 'nouvelles', 'point'],
  limites: ['limite', 'espace', 'frontière', 'non'],
  repos: ['repos', 'pause', 'récupérer'],
  micro: ['micro', 'ping', 'signe', 'discret'],
  corporel: ['corps', 'respiration', 'posture', 'main', 'regard'],
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
    micro: 'Micro-lien',
    corporel: 'Ancrage corporel',
    panique: 'Pic d’angoisse',
    presence: 'Besoin de présence',
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
