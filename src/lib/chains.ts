import {
  SUPPORT_MESSAGES,
  type MessageCategory,
  type SupportOpening,
} from '@/lib/messages';

/**
 * Enchaînement A → B sans chat libre.
 * Après un message reçu / une réponse, proposer 3 ouvertures cohérentes.
 */
const NEXT_BY_CATEGORY: Partial<Record<MessageCategory, MessageCategory[]>> = {
  salutation: ['presence', 'micro', 'checkin'],
  presence: ['douceur', 'micro', 'remerciement'],
  douceur: ['presence', 'repos', 'remerciement'],
  difficile: ['presence', 'douceur', 'courage'],
  solitude: ['presence', 'micro', 'douceur'],
  anxiete: ['presence', 'repos', 'micro'],
  panique: ['presence', 'repos', 'corporel'],
  fatigue: ['repos', 'douceur', 'presence'],
  nuit: ['repos', 'presence', 'douceur'],
  matin: ['courage', 'presence', 'motivation'],
  courage: ['fierte', 'presence', 'remerciement'],
  motivation: ['courage', 'fierte', 'presence'],
  travail: ['limites', 'repos', 'presence'],
  remerciement: ['presence', 'micro', 'cloture'],
  checkin: ['presence', 'micro', 'douceur'],
  micro: ['presence', 'douceur', 'remerciement'],
  cloture: ['remerciement', 'depart', 'presence'],
  depart: ['remerciement', 'cloture'],
  deuil: ['presence', 'douceur', 'repos'],
  colere: ['limites', 'presence', 'douceur'],
};

const FALLBACK_CHAIN: MessageCategory[] = [
  'presence',
  'micro',
  'douceur',
  'remerciement',
];

/** Phrases de réponse universelles si l’opening n’en a pas assez */
export const UNIVERSAL_REPLIES = [
  'Merci. Je reçois.',
  'Ça m’aide un peu.',
  'Je suis encore là.',
  'Doucement. Merci.',
  'Reçu. Sans plus pour l’instant.',
  'Merci d’être là.',
];

export function getChainAfter(
  category: MessageCategory | undefined,
  excludeIds: string[] = [],
  limit = 3
): SupportOpening[] {
  const cats = category
    ? NEXT_BY_CATEGORY[category] || FALLBACK_CHAIN
    : FALLBACK_CHAIN;

  const picked: SupportOpening[] = [];
  const used = new Set(excludeIds);

  for (const cat of cats) {
    const pool = SUPPORT_MESSAGES.filter(
      (m) =>
        m.category === cat &&
        !used.has(m.id) &&
        (m.intensity ?? 2) <= 2
    );
    if (!pool.length) continue;
    const m = pool[Math.floor(Math.random() * Math.min(4, pool.length))];
    used.add(m.id);
    picked.push(m);
    if (picked.length >= limit) break;
  }

  while (picked.length < limit) {
    const m =
      SUPPORT_MESSAGES[Math.floor(Math.random() * SUPPORT_MESSAGES.length)];
    if (used.has(m.id)) continue;
    if ((m.intensity ?? 2) > 2) continue;
    used.add(m.id);
    picked.push(m);
  }

  return picked;
}

export function repliesForOpening(opening: SupportOpening | undefined): string[] {
  if (opening?.responses?.length) {
    return opening.responses.slice(0, 5);
  }
  return UNIVERSAL_REPLIES.slice(0, 4);
}
