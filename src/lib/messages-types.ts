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
  | 'repos'
  | 'micro'
  | 'corporel';

export type MessageIntent = 'offer' | 'seek' | 'both';
export type MessageTone = 'doux' | 'neutre' | 'energique' | 'court';

/** Intensité émotionnelle / engagement du message */
export type MessageIntensity = 1 | 2 | 3;

export interface SupportOpening {
  id: string;
  category: MessageCategory;
  text: string;
  responses: string[];
  intent?: MessageIntent;
  tone?: MessageTone;
  /** 1 = léger / micro · 2 = moyen · 3 = profond */
  intensity?: MessageIntensity;
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
  micro: 'Micro-lien',
  corporel: 'Langage du corps',
};

export const TONE_LABELS: Record<MessageTone, string> = {
  doux: 'Doux',
  neutre: 'Neutre',
  energique: 'Énergique',
  court: 'Court',
};

export const INTENSITY_LABELS: Record<MessageIntensity, string> = {
  1: 'Léger',
  2: 'Moyen',
  3: 'Profond',
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
  'micro',
  'corporel',
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
    [
      'douceur',
      'nuit',
      'deuil',
      'depart',
      'solitude',
      'panique',
      'repos',
      'salutation',
      'micro',
      'corporel',
    ].includes(category)
  )
    return 'doux';
  return 'neutre';
}

export function getDefaultIntensity(category: MessageCategory): MessageIntensity {
  if (['micro', 'salutation', 'checkin', 'corporel'].includes(category)) return 1;
  if (['panique', 'deuil', 'colere', 'difficile'].includes(category)) return 3;
  return 2;
}
