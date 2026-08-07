/** Notifications e-mail désactivées — volontairement no-op. */

export async function sendNotifyEmail(_options: {
  to: string;
  subject: string;
  html: string;
}): Promise<{ sent: boolean; reason?: string }> {
  return { sent: false, reason: 'e-mail désactivé' };
}

export async function notifyPactMatched(_email: string, _pactId: string) {
  return sendNotifyEmail({ to: '', subject: '', html: '' });
}

export async function notifyExtendPrompt(_email: string, _pactId: string) {
  return sendNotifyEmail({ to: '', subject: '', html: '' });
}

export async function notifyNewActivity(_email: string, _pactId: string) {
  return sendNotifyEmail({ to: '', subject: '', html: '' });
}
