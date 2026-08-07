import type { MessageCategory, SupportOpening } from './messages-types';
export type { MessageCategory, SupportOpening } from './messages-types';
export { CATEGORY_LABELS } from './messages-types';

// Messages chargés depuis le fichier data (évite un monolithe)
// En build, on importe les parties
import { PART0 } from './messages-part0';
import { PART1 } from './messages-part1';
import { PART2 } from './messages-part2';

export const SUPPORT_MESSAGES: SupportOpening[] = [
  ...PART0,
  ...PART1,
  ...PART2,
];

export function getMessageById(id: string): SupportOpening | undefined {
  return SUPPORT_MESSAGES.find((m) => m.id === id);
}

export function getMessagesByCategory(category: MessageCategory): SupportOpening[] {
  return SUPPORT_MESSAGES.filter((m) => m.category === category);
}

export function searchMessages(query: string): SupportOpening[] {
  const q = query.toLowerCase().trim();
  if (!q) return SUPPORT_MESSAGES;
  return SUPPORT_MESSAGES.filter((m) => m.text.toLowerCase().includes(q));
}

export function getMessageCount(): number {
  return SUPPORT_MESSAGES.length;
}

export function getThankYouMessages(): SupportOpening[] {
  return SUPPORT_MESSAGES.filter((m) => m.category === 'remerciement');
}
