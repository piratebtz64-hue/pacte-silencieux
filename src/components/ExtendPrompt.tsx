'use client';

import { useEffect, useState } from 'react';

interface Props {
  pactId: string;
  userId: string;
  endsAt: string | null;
  onResolved?: () => void;
}

export default function ExtendPrompt({
  pactId,
  userId,
  endsAt,
  onResolved,
}: Props) {
  const [phase, setPhase] = useState<
    | 'loading'
    | 'hidden'
    | 'prompt'
    | 'waiting_other'
    | 'extended'
    | 'ended'
    | 'timeout'
  >('loading');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    if (!pactId || !userId) {
      setPhase('hidden');
      return;
    }
    try {
      const res = await fetch(
        `/api/extend?pactId=${encodeURIComponent(pactId)}&userId=${encodeURIComponent(userId)}`
      );
      if (!res.ok) {
        setPhase('hidden');
        return;
      }
      const data = await res.json();
      setPhase(data.phase || 'hidden');
      if (
        data.phase === 'extended' ||
        data.phase === 'ended' ||
        data.phase === 'timeout'
      ) {
        onResolved?.();
      }
    } catch {
      setPhase('hidden');
    }
  };

  useEffect(() => {
    load();
    const t = setInterval(load, 20000);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pactId, userId]);

  const vote = async (v: 'yes' | 'no') => {
    setSending(true);
    setError(null);
    try {
      const res = await fetch('/api/extend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pactId, userId, vote: v }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erreur');
      if (data.result === 'extended' || data.result === 'ended') {
        setPhase(data.result);
        onResolved?.();
      } else {
        setPhase('waiting_other');
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erreur');
    } finally {
      setSending(false);
    }
  };

  if (phase === 'loading' || phase === 'hidden') return null;

  if (phase === 'waiting_other') {
    return (
      <div
        className="mt-6 p-5 rounded-2xl border"
        style={{
          borderColor: 'color-mix(in srgb, var(--accent) 30%, transparent)',
          background: 'var(--accent-soft)',
        }}
      >
        <p className="text-sm font-bold" style={{ color: 'var(--accent)' }}>
          Vote enregistré
        </p>
        <p className="mt-2 text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>
          En attente de l’autre personne. Les votes restent secrets jusqu’aux
          deux réponses. Si les deux disent oui → +7 jours, historique conservé.
        </p>
      </div>
    );
  }

  if (phase === 'extended') {
    return (
      <div
        className="mt-6 p-5 rounded-2xl border"
        style={{
          borderColor: 'color-mix(in srgb, var(--accent) 35%, transparent)',
          background: 'var(--accent-soft)',
        }}
      >
        <p className="text-sm font-bold" style={{ color: 'var(--accent)' }}>
          Pacte prolongé
        </p>
        <p className="mt-2 text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>
          Vous avez tous les deux accepté. +7 jours. Vous retrouvez le même fil.
        </p>
      </div>
    );
  }

  if (phase === 'ended' || phase === 'timeout') {
    return (
      <div
        className="mt-6 p-5 rounded-2xl border"
        style={{ borderColor: 'var(--border)', background: 'var(--mist)' }}
      >
        <p className="text-sm font-bold">Pacte terminé</p>
        <p className="mt-2 text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>
          Merci pour le temps partagé. Tu peux relire le fil ci-dessous ou
          recommencer un autre jour.
        </p>
      </div>
    );
  }

  const endLabel = endsAt
    ? new Date(endsAt).toLocaleString('fr-FR', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
      })
    : '';

  return (
    <div
      className="mt-6 p-5 rounded-2xl border-2 shadow-sm"
      style={{
        borderColor: 'color-mix(in srgb, var(--accent) 40%, transparent)',
        background: 'var(--card-solid)',
      }}
    >
      <p className="section-label">Fin de cycle</p>
      <h2 className="mt-2 text-lg font-serif tracking-tight">
        Continuer une semaine ?
      </h2>
      <p className="mt-2 text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>
        Le pacte
        {endLabel ? ` se termine vers le ${endLabel}` : ' arrive à sa fin'}.
        Si <strong>vous deux</strong> répondez oui → +7 jours, même historique.
        Si l’un dit non (ou ne répond pas) → clôture en douceur.
      </p>
      <p className="mt-2 text-xs" style={{ color: 'var(--muted)' }}>
        Ton vote reste secret jusqu’à la réponse de l’autre.
      </p>

      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

      <div className="mt-5 grid grid-cols-2 gap-3">
        <button
          type="button"
          disabled={sending}
          onClick={() => vote('yes')}
          className="btn-primary min-h-[48px] disabled:opacity-50"
        >
          Oui
        </button>
        <button
          type="button"
          disabled={sending}
          onClick={() => vote('no')}
          className="btn-ghost min-h-[48px] disabled:opacity-50"
        >
          Non
        </button>
      </div>
    </div>
  );
}
