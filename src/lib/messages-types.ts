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
  | 'motivation'
  | 'depart'
  | 'solitude'
  | 'fierte'
  | 'transition'
  | 'travail'
  | 'panique'
  | 'famille'
  | 'salutation'
  | 'checkin'
  | 'limites'
  | 'repos';

export type MessageIntent = 'offer' | 'seek' | 'both';
export type MessageTone = 'doux' | 'neutre' | 'energique' | 'court';

export interface SupportOpening {
  id: string;
  category: MessageCategory;
  text: string;
  responses: string[];
  intent?: MessageIntent;
  tone?: MessageTone;
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
  depart: 'Départ / au revoir',
  solitude: 'Solitude',
  fierte: 'Petite fierté',
  transition: 'Changement',
  travail: 'Travail / stress',
  panique: 'Crise / panique',
  famille: 'Famille / proche',
  salutation: 'Salutations',
  checkin: 'Prise de nouvelles',
  limites: 'Limites / espace',
  repos: 'Repos / pause',
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
  'depart',
  'fierte',
  'salutation',
  'checkin',
];

export const SEEK_CATEGORIES: MessageCategory[] = [
  'difficile',
  'fatigue',
  'anxiete',
  'nuit',
  'deuil',
  'colere',
  'reconnexion',
  'solitude',
  'transition',
  'travail',
  'panique',
  'famille',
  'limites',
  'repos',
];

export function getIntentForCategory(category: MessageCategory): MessageIntent {
  if (OFFER_CATEGORIES.includes(category) && !SEEK_CATEGORIES.includes(category))
    return 'offer';
  if (SEEK_CATEGORIES.includes(category) && !OFFER_CATEGORIES.includes(category))
    return 'seek';
  return 'both';
}

export function getDefaultTone(category: MessageCategory): MessageTone {
  if (['motivation', 'courage', 'fierte'].includes(category)) return 'energique';
  if (
    ['douceur', 'nuit', 'deuil', 'depart', 'solitude', 'panique', 'repos', 'salutation'].includes(
      category
    )
  )
    return 'doux';
  return 'neutre';
}
