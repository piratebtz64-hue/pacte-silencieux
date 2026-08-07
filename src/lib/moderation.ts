/**
 * Modération automatique légère — mots/patterns interdits.
 * Pas de chat libre sur le site, mais utile pour signalements, contact, futurs champs.
 */

const BLOCKED = [
  // Insultes / haine (liste courte, non exhaustive)
  'connard',
  'connasse',
  'salope',
  'pd',
  'fdp',
  'ntm',
  'nique',
  'enculé',
  'encule',
  'pute',
  'tapette',
  'négro',
  'negro',
  'bougnoule',
  'islamiste à tuer',
  // Incitation / danger
  'suicide-toi',
  'suicide toi',
  'tue-toi',
  'tue toi',
  'va mourir',
  'va te suicider',
];

const WARNING = [
  'je vais me tuer',
  'je veux mourir',
  'j\'en peux plus je vais',
];

export type ModerationResult = {
  allowed: boolean;
  reason?: string;
  crisisHint?: boolean;
};

function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .replace(/[^a-z0-9àâäéèêëïîôùûüç\s'-]/gi, ' ');
}

export function moderateText(raw: string): ModerationResult {
  const text = normalize(raw || '');
  if (!text.trim()) {
    return { allowed: true };
  }

  for (const w of BLOCKED) {
    if (text.includes(normalize(w))) {
      return {
        allowed: false,
        reason:
          'Ce message ne peut pas être envoyé. Merci de rester respectueux.',
      };
    }
  }

  for (const w of WARNING) {
    if (text.includes(normalize(w))) {
      return {
        allowed: true,
        crisisHint: true,
        reason:
          'Si tu es en détresse, tu peux appeler le 3114 (France), 24h/24.',
      };
    }
  }

  // Flood / spam simple
  if (/(.)\1{8,}/.test(text) || text.length > 2000) {
    return {
      allowed: false,
      reason: 'Message trop long ou invalide.',
    };
  }

  return { allowed: true };
}

/** Pour l’API — log minimal sans stocker le contenu brut */
export function moderationLog(kind: string, allowed: boolean) {
  if (process.env.NODE_ENV !== 'production') {
    console.log(`[moderation] ${kind} allowed=${allowed}`);
  }
}
