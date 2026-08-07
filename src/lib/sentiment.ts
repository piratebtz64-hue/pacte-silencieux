import type { MessageCategory } from './messages';

/**
 * Analyse légère et locale (sans API externe).
 * Suggère une catégorie selon des mots-clés — privée, instantanée, gratuite.
 */
const KEYWORDS: Record<MessageCategory, string[]> = {
  presence: ['seul', 'présence', 'là', 'accompagne', 'avec moi'],
  difficile: ['difficile', 'lourd', 'dur', 'mal', 'galère', 'pénible'],
  fatigue: ['fatigué', 'épuisé', 'lasse', 'sommeil', 'dormir', 'crevé'],
  courage: ['courage', 'force', 'tenir', 'continue', 'bataille'],
  gratitude: ['merci', 'reconnaissant', 'gratitude', 'chance'],
  nuit: ['nuit', 'insomnie', 'minuit', 'soir', 'obscur'],
  espoir: ['espoir', 'demain', 'mieux', 'possible', 'avenir'],
  anxiete: ['anxiété', 'angoisse', 'stress', 'peur', 'inquiet', 'panique'],
  douceur: ['doux', 'douceur', 'tendre', 'câlin', 'chaleur'],
  matin: ['matin', 'réveil', 'journée', 'bonjour'],
  colere: ['colère', 'énervé', 'furieux', 'injuste', 'rage'],
  deuil: ['deuil', 'perte', 'manque', 'parti', 'chagrin', 'deuil'],
  reconnexion: ['revenir', 'retour', 'reprendre', 'reconnexion'],
  cloture: ['au revoir', 'fin', 'terminer', 'clôturer', 'adieu'],
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
    difficile: 'Jour difficile ressenti',
    fatigue: 'Fatigue détectée',
    anxiete: 'Anxiété possible',
    nuit: 'Nuit / solitude',
    colere: 'Colère présente',
    deuil: 'Perte / chagrin',
    espoir: 'Ouverture vers l’espoir',
    douceur: 'Besoin de douceur',
  };
  return labels[cat] || null;
}
