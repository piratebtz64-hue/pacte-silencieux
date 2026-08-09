/** Textes de partage optimisés (surtout WhatsApp mobile). */

export const SITE_URL =
  process.env.NEXT_PUBLIC_APP_URL || 'https://pacte-silencieux.vercel.app';

/** Message court, lisible sur WhatsApp (sauts de ligne). */
export const WHATSAPP_INVITE = `Salut — je teste « Le Pacte silencieux ».

Présence anonyme, messages déjà écrits, pas de chat libre. 1, 3 ou 7 jours.

Pour essayer à deux (2 min) :
1) Ouvre le lien
2) Email différent du mien
3) Même durée que moi
4) Reste sur la page d’attente

${SITE_URL}`;

export const SHARE_SHORT =
  'Le Pacte silencieux — présence anonyme sans chat. On peut tester à deux (même durée + attente). ';

export function whatsappShareHref(text: string = WHATSAPP_INVITE) {
  return `https://wa.me/?text=${encodeURIComponent(text)}`;
}
