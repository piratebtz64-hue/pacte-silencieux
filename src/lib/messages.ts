import type {
  MessageCategory,
  MessageIntent,
  SupportOpening,
} from './messages-types';
import {
  CATEGORY_LABELS,
  getIntentForCategory,
} from './messages-types';

export type { MessageCategory, MessageIntent, SupportOpening } from './messages-types';
export {
  CATEGORY_LABELS,
  OFFER_CATEGORIES,
  SEEK_CATEGORIES,
  getIntentForCategory,
} from './messages-types';

import { PART0 } from './messages-part0';
import { PART1 } from './messages-part1';
import { PART2 } from './messages-part2';
import { PART3 } from './messages-part3';

export const SUPPORT_MESSAGES: SupportOpening[] = [
  ...PART0,
  ...PART1,
  ...PART2,
  ...PART3,
].map((m) => ({
  ...m,
  intent: m.intent || getIntentForCategory(m.category),
}));

export function getMessageById(id: string): SupportOpening | undefined {
  return SUPPORT_MESSAGES.find((m) => m.id === id);
}

export function getMessagesByCategory(category: MessageCategory): SupportOpening[] {
  return SUPPORT_MESSAGES.filter((m) => m.category === category);
}

export function getMessagesByIntent(intent: MessageIntent | 'all'): SupportOpening[] {
  if (intent === 'all') return SUPPORT_MESSAGES;
  return SUPPORT_MESSAGES.filter(
    (m) => m.intent === intent || m.intent === 'both'
  );
}

export function searchMessages(
  query: string,
  intent: MessageIntent | 'all' = 'all'
): SupportOpening[] {
  const base = getMessagesByIntent(intent);
  const q = query.toLowerCase().trim();
  if (!q) return base;
  return base.filter(
    (m) =>
      m.text.toLowerCase().includes(q) ||
      CATEGORY_LABELS[m.category].toLowerCase().includes(q)
  );
}

export function getMessageCount(): number {
  return SUPPORT_MESSAGES.length;
}
