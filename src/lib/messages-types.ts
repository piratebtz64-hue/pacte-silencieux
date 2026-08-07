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
  | 'remerciement';

/** Intention du message : offrir du soutien ou en demander */
export type MessageIntent = 'offer' | 'seek' | 'both';

export interface SupportOpening {
  id: string;
  category: MessageCategory;
  text: string;
  responses: string[];
  intent?: MessageIntent;
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
};

/** Catégories plutôt « j’offre du soutien » */
export const OFFER_CATEGORIES: MessageCategory[] = [
  'presence',
  'courage',
  'douceur',
  'espoir',
  'gratitude',
  'matin',
  'remerciement',
  'cloture',
];

/** Catégories plutôt « j’ai besoin de soutien » */
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
