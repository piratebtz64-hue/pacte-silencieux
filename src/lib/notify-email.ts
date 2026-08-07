/**
 * Notifications e-mail optionnelles via Resend.
 * Si RESEND_API_KEY n’est pas défini, l’envoi est ignoré (pas d’erreur bloquante).
 */

const RESEND_KEY = process.env.RESEND_API_KEY;
const FROM =
  process.env.EMAIL_FROM || 'Le Pacte silencieux <onboarding@resend.dev>';
const APP_URL =
  process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, '') ||
  'https://pacte-silencieux.vercel.app';

export async function sendNotifyEmail(options: {
  to: string;
  subject: string;
  html: string;
}): Promise<{ sent: boolean; reason?: string }> {
  if (!RESEND_KEY) {
    return { sent: false, reason: 'RESEND_API_KEY non configurée' };
  }

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${RESEND_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: FROM,
        to: [options.to],
        subject: options.subject,
        html: options.html,
      }),
    });

    if (!res.ok) {
      const t = await res.text();
      console.error('Resend error:', t);
      return { sent: false, reason: t };
    }
    return { sent: true };
  } catch (e) {
    console.error('Email exception:', e);
    return { sent: false, reason: String(e) };
  }
}

export async function notifyPactMatched(email: string, pactId: string) {
  return sendNotifyEmail({
    to: email,
    subject: 'Votre pacte a commencé — Le Pacte silencieux',
    html: `
      <p>Bonjour,</p>
      <p>Une présence anonyme est maintenant reliée à la tienne.</p>
      <p><a href="${APP_URL}/pact/${pactId}">Ouvrir le pacte</a></p>
      <p style="color:#706b63;font-size:12px">Tu peux aussi retrouver le lien depuis le même appareil.</p>
    `,
  });
}

export async function notifyExtendPrompt(email: string, pactId: string) {
  return sendNotifyEmail({
    to: email,
    subject: 'Ton pacte se termine bientôt — prolonger ?',
    html: `
      <p>Bonjour,</p>
      <p>Ton pacte arrive à sa fin. Tu peux choisir de prolonger de 7 jours si l’autre personne accepte aussi.</p>
      <p><a href="${APP_URL}/pact/${pactId}">Répondre Oui ou Non</a></p>
      <p style="color:#706b63;font-size:12px">Sans réponse sous 48 h après la fin, le pacte se clôture.</p>
    `,
  });
}

export async function notifyNewActivity(email: string, pactId: string) {
  return sendNotifyEmail({
    to: email,
    subject: 'Nouveau message sur ton pacte',
    html: `
      <p>Bonjour,</p>
      <p>Quelqu’un a envoyé un geste ou un message sur ton pacte.</p>
      <p><a href="${APP_URL}/pact/${pactId}">Voir le fil</a></p>
    `,
  });
}
