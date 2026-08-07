export type MessageCategory =
  | 'presence'
  | 'difficile'
  | 'fatigue'
  | 'courage'
  | 'gratitude'
  | 'nuit'
  | 'espoir'
  | 'anxiete'
  | 'douceur'
  | 'matin'
  | 'colere'
  | 'deuil'
  | 'reconnexion'
  | 'cloture'
  | 'remerciement'
  | 'motivation';

/** Intention : offrir / demander / les deux */
export type MessageIntent = 'offer' | 'seek' | 'both';

/** Ton du message */
export type MessageTone = 'doux' | 'neutre' | 'energique' | 'court';

export interface SupportOpening {
  id: string;
  category: MessageCategory;
  text: string;
  responses: string[];
  intent?: MessageIntent;
  tone?: MessageTone;
  /** Attribution courte pour citations (optionnel) */
  source?: string;
}

export const CATEGORY_LABELS: Record<MessageCategory, string> = {
  presence: 'Présence',
  difficile: 'Jour difficile',
  fatigue: 'Fatigue',
  courage: 'Courage',
  gratitude: 'Gratitude',
  nuit: 'Nuit',
  espoir: 'Espoir',
  anxiete: 'Anxiété',
  douceur: 'Douceur',
  matin: 'Matin',
  colere: 'Colère',
  deuil: 'Deuil / perte',
  reconnexion: 'Reconnexion',
  cloture: 'Clôture',
  remerciement: 'Remerciement',
  motivation: 'Motivation',
};

export const TONE_LABELS: Record<MessageTone, string> = {
  doux: 'Doux',
  neutre: 'Neutre',
  energique: 'Énergique',
  court: 'Court',
};

export const OFFER_CATEGORIES: MessageCategory[] = [
  'presence',
  'courage',
  'douceur',
  'espoir',
  'gratitude',
  'matin',
  'remerciement',
  'cloture',
  'motivation',
];

export const SEEK_CATEGORIES: MessageCategory[] = [
  'difficile',
  'fatigue',
  'anxiete',
  'nuit',
  'deuil',
  'colere',
  'reconnexion',
];

export function getIntentForCategory(category: MessageCategory): MessageIntent {
  if (OFFER_CATEGORIES.includes(category) && !SEEK_CATEGORIES.includes(category)) {
    return 'offer';
  }
  if (SEEK_CATEGORIES.includes(category) && !OFFER_CATEGORIES.includes(category)) {
    return 'seek';
  }
  return 'both';
}

export function getDefaultTone(category: MessageCategory): MessageTone {
  if (category === 'motivation' || category === 'courage') return 'energique';
  if (category === 'douceur' || category === 'nuit' || category === 'deuil') return 'doux';
  return 'neutre';
}
