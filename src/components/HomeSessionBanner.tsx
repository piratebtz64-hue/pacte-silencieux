'use client';

import { useEffect, useState } from 'react';
import { hasSessionHint, readSession, resolveAndSyncSession, clearSession } from '@/lib/session';

/**
 * Sur l’accueil : si une session existe, proposer clairement de reprendre
 * le pacte (actif ou attente) sans repasser par l’inscription.
 */
export default function HomeSessionBanner() {
  const [visible, setVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('');
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!hasSessionHint()) return;
    const s = readSession();
    setEmail(s.email);
    setStatus(s.status);
    setVisible(true);
  }, []);

  if (!visible) return null;

  const resume = async () => {
    setBusy(true);
    setMsg(null);
    const result = await resolveAndSyncSession(email || undefined);
    setBusy(false);
    if (result.ok && result.continueUrl) {
      window.location.assign(result.continueUrl);
      return;
    }
    setMsg(result.error || 'Aucun pacte en cours. Tu peux en commencer un nouveau.');
  };

  const forget = () => {
    clearSession();
    setVisible(false);
  };

  return (
    <div
      className="border-b"
      style={{
        borderColor: 'color-mix(in srgb, var(--accent) 25%, transparent)',
        background: 'var(--accent-soft)',
      }}
    >
      <div className="max-w-6xl mx-auto px-4 py-3.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <p className="text-sm font-semibold" style={{ color: 'var(--accent)' }}>
            {status === 'ACTIVE'
              ? 'Tu as un pacte en cours'
              : status === 'WAITING'
                ? 'Tu es en attente d’une présence'
                : 'Session enregistrée sur cet appareil'}
          </p>
          <p className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>
            {email
              ? `${email} · reprends sans te réinscrire`
              : 'Indique le même email sur « Commencer » pour retrouver ton fil'}
          </p>
          {msg && (
            <p className="text-xs mt-1 text-red-600 dark:text-red-400">{msg}</p>
          )}
        </div>
        <div className="flex flex-wrap gap-2 items-center">
          <button
            type="button"
            disabled={busy}
            onClick={resume}
            className="btn-primary !py-2 !px-4 !text-sm disabled:opacity-60"
          >
            {busy ? 'Ouverture…' : 'Reprendre mon pacte'}
          </button>
          <button
            type="button"
            onClick={forget}
            className="text-xs px-2 py-1"
            style={{ color: 'var(--muted)' }}
          >
            Oublier cet appareil
          </button>
        </div>
      </div>
    </div>
  );
}
