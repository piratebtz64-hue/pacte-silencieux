'use client';

import { useState } from 'react';
import { writeSession } from '@/lib/session';

/** Si userId perdu : même email → on ré-attache la session au pacte */
export default function SessionRecover({
  pactId,
  onRecovered,
}: {
  pactId: string;
  onRecovered: (userId: string) => void;
}) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          durationDays: 3,
          forceNew: false,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erreur');

      writeSession({
        email,
        userId: data.userId || '',
        pactId: data.pactId || pactId,
      });

      if (data.userId) onRecovered(data.userId);

      if (data.resume && data.pactId && data.pactId !== pactId) {
        window.location.href = `/pact/${data.pactId}`;
        return;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="mt-4 p-4 rounded-xl border text-sm"
      style={{
        borderColor: 'color-mix(in srgb, var(--accent) 35%, transparent)',
        background: 'var(--accent-soft)',
      }}
    >
      <p className="font-semibold" style={{ color: 'var(--accent)' }}>
        Session incomplète sur cet appareil
      </p>
      <p className="mt-1" style={{ color: 'var(--muted)' }}>
        Entre le <strong>même email</strong> que lors de l’inscription pour
        renvoyer et répondre sans recommencer un nouveau pacte.
      </p>
      <form onSubmit={submit} className="mt-3 flex flex-col sm:flex-row gap-2">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="ton@email.com"
          className="flex-1 px-3 py-2 rounded-lg border text-sm"
          style={{
            borderColor: 'var(--border)',
            background: 'var(--card-solid)',
          }}
        />
        <button
          type="submit"
          disabled={loading}
          className="btn-primary !py-2 !px-4 !text-sm disabled:opacity-60"
        >
          {loading ? '…' : 'Me reconnecter'}
        </button>
      </form>
      {error && (
        <p className="mt-2 text-xs text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  );
}
