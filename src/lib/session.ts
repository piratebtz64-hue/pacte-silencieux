/** Session navigateur — identité légère pour reprendre un pacte */

export const SESSION_KEYS = {
  email: 'pacte_email',
  userId: 'pacte_userId',
  pactId: 'pacte_pactId',
  duration: 'pacte_duration',
  status: 'pacte_status', // ACTIVE | WAITING | ''
} as const;

export type SessionData = {
  email: string;
  userId: string;
  pactId: string;
  duration: string;
  status: string;
};

export function readSession(): SessionData {
  if (typeof window === 'undefined') {
    return { email: '', userId: '', pactId: '', duration: '', status: '' };
  }
  return {
    email: localStorage.getItem(SESSION_KEYS.email) || '',
    userId: localStorage.getItem(SESSION_KEYS.userId) || '',
    pactId: localStorage.getItem(SESSION_KEYS.pactId) || '',
    duration: localStorage.getItem(SESSION_KEYS.duration) || '',
    status: localStorage.getItem(SESSION_KEYS.status) || '',
  };
}

export function writeSession(
  partial: Partial<SessionData>
) {
  if (typeof window === 'undefined') return;
  if (partial.email !== undefined)
    localStorage.setItem(
      SESSION_KEYS.email,
      partial.email.toLowerCase().trim()
    );
  if (partial.userId !== undefined)
    localStorage.setItem(SESSION_KEYS.userId, partial.userId);
  if (partial.pactId !== undefined)
    localStorage.setItem(SESSION_KEYS.pactId, partial.pactId);
  if (partial.duration !== undefined)
    localStorage.setItem(SESSION_KEYS.duration, partial.duration);
  if (partial.status !== undefined)
    localStorage.setItem(SESSION_KEYS.status, partial.status);
}

export function clearSession() {
  if (typeof window === 'undefined') return;
  Object.values(SESSION_KEYS).forEach((k) => localStorage.removeItem(k));
}

export function hasSessionHint() {
  const s = readSession();
  return !!(s.email || s.pactId || s.userId);
}

/** Résout le vrai pacte côté serveur et met à jour la session locale */
export async function resolveAndSyncSession(email?: string): Promise<{
  ok: boolean;
  status: 'ACTIVE' | 'WAITING' | 'NONE';
  pactId: string;
  userId: string;
  continueUrl: string;
  error?: string;
}> {
  const s = readSession();
  const mail = (email || s.email || '').toLowerCase().trim();
  if (!mail) {
    return {
      ok: false,
      status: 'NONE',
      pactId: '',
      userId: '',
      continueUrl: '/start',
      error: 'Email manquant',
    };
  }

  try {
    const res = await fetch('/api/start', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: mail,
        durationDays: Number(s.duration) || 3,
        forceNew: false,
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      return {
        ok: false,
        status: 'NONE',
        pactId: '',
        userId: '',
        continueUrl: '/start',
        error: data.error || 'Erreur',
      };
    }

    const status =
      data.status === 'ACTIVE'
        ? 'ACTIVE'
        : data.status === 'WAITING' || data.resume
          ? data.status === 'ACTIVE'
            ? 'ACTIVE'
            : 'WAITING'
          : data.resume
            ? 'WAITING'
            : 'NONE';

    // Si resume actif ou waiting
    if (data.resume && data.pactId) {
      const st = data.status === 'ACTIVE' ? 'ACTIVE' : 'WAITING';
      writeSession({
        email: mail,
        userId: data.userId || '',
        pactId: data.pactId,
        status: st,
      });
      return {
        ok: true,
        status: st,
        pactId: data.pactId,
        userId: data.userId || '',
        continueUrl:
          st === 'ACTIVE' ? `/pact/${data.pactId}` : '/waiting',
      };
    }

    // Nouveau pacte créé (pas de reprise)
    if (data.pactId) {
      writeSession({
        email: mail,
        userId: data.userId || '',
        pactId: data.pactId,
        status: 'WAITING',
      });
      return {
        ok: true,
        status: 'WAITING',
        pactId: data.pactId,
        userId: data.userId || '',
        continueUrl: '/waiting',
      };
    }

    return {
      ok: false,
      status: 'NONE',
      pactId: '',
      userId: '',
      continueUrl: '/start',
    };
  } catch (e) {
    return {
      ok: false,
      status: 'NONE',
      pactId: '',
      userId: '',
      continueUrl: '/start',
      error: e instanceof Error ? e.message : 'Erreur',
    };
  }
}

export function pactPath(pactId: string) {
  return `/pact/${pactId}`;
}
