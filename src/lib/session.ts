/** Session navigateur — ne pas perdre le fil du pacte */

export const SESSION_KEYS = {
  email: 'pacte_email',
  userId: 'pacte_userId',
  pactId: 'pacte_pactId',
  duration: 'pacte_duration',
} as const;

export function readSession() {
  if (typeof window === 'undefined') {
    return { email: '', userId: '', pactId: '', duration: '' };
  }
  return {
    email: localStorage.getItem(SESSION_KEYS.email) || '',
    userId: localStorage.getItem(SESSION_KEYS.userId) || '',
    pactId: localStorage.getItem(SESSION_KEYS.pactId) || '',
    duration: localStorage.getItem(SESSION_KEYS.duration) || '',
  };
}

export function writeSession( partial: {
  email?: string;
  userId?: string;
  pactId?: string;
  duration?: string;
}) {
  if (typeof window === 'undefined') return;
  if (partial.email !== undefined)
    localStorage.setItem(SESSION_KEYS.email, partial.email.toLowerCase().trim());
  if (partial.userId !== undefined)
    localStorage.setItem(SESSION_KEYS.userId, partial.userId);
  if (partial.pactId !== undefined)
    localStorage.setItem(SESSION_KEYS.pactId, partial.pactId);
  if (partial.duration !== undefined)
    localStorage.setItem(SESSION_KEYS.duration, partial.duration);
}

export function pactPath(pactId: string) {
  return `/pact/${pactId}`;
}
