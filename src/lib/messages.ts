import type {
  MessageCategory,
  MessageIntent,
  MessageTone,
  SupportOpening,
} from './messages-types';
import {
  CATEGORY_LABELS,
  TONE_LABELS,
  getIntentForCategory,
  getDefaultTone,
} from './messages-types';

export type {
  MessageCategory,
  MessageIntent,
  MessageTone,
  SupportOpening,
} from './messages-types';
export {
  CATEGORY_LABELS,
  TONE_LABELS,
  OFFER_CATEGORIES,
  SEEK_CATEGORIES,
  getIntentForCategory,
  getDefaultTone,
} from './messages-types';

import { PART0 } from './messages-part0';
import { PART1 } from './messages-part1';
import { PART2 } from './messages-part2';
import { PART3 } from './messages-part3';
import { PART4 } from './messages-part4';
import { PART5 } from './messages-part5';
import { PART6 } from './messages-part6';
import { PART7 } from './messages-part7';
import { PART8 } from './messages-part8';
import { PART9 } from './messages-part9';
import { PART10 } from './messages-part10';

export const SUPPORT_MESSAGES: SupportOpening[] = [
  ...PART0,
  ...PART1,
  ...PART2,
  ...PART3,
  ...PART4,
  ...PART5,
  ...PART6,
  ...PART7,
  ...PART8,
  ...PART9,
  ...PART10,
].map((m) => ({
  ...m,
  intent: m.intent || getIntentForCategory(m.category),
  tone: m.tone || getDefaultTone(m.category),
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

export function filterMessages(options: {
  intent?: MessageIntent | 'all';
  category?: MessageCategory | 'all' | 'fav';
  tone?: MessageTone | 'all';
  search?: string;
  favorites?: string[];
}): SupportOpening[] {
  const {
    intent = 'all',
    category = 'all',
    tone = 'all',
    search = '',
    favorites = [],
  } = options;

  let list = getMessagesByIntent(intent);

  if (category === 'fav') {
    list = list.filter((m) => favorites.includes(m.id));
  } else if (category !== 'all') {
    list = list.filter((m) => m.category === category);
  }

  if (tone !== 'all') {
    list = list.filter((m) => m.tone === tone);
  }

  const q = search.toLowerCase().trim();
  if (q) {
    list = list.filter(
      (m) =>
        m.text.toLowerCase().includes(q) ||
        CATEGORY_LABELS[m.category].toLowerCase().includes(q) ||
        (m.source && m.source.toLowerCase().includes(q))
    );
  }

  return list;
}

export function searchMessages(
  query: string,
  intent: MessageIntent | 'all' = 'all'
): SupportOpening[] {
  return filterMessages({ intent, search: query });
}

export function getMessageCount(): number {
  return SUPPORT_MESSAGES.length;
}
