'use client';

import { useEffect, useState } from 'react';

interface Props {
  pactId: string;
  userId: string;
  endsAt: string | null;
  onResolved?: () => void;
}

export default function ExtendPrompt({ pactId, userId, endsAt, onResolved }: Props) {
  const [phase, setPhase] = useState<
    'loading' | 'hidden' | 'prompt' | 'waiting_other' | 'extended' | 'ended' | 'timeout'
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
      if (data.phase === 'extended' || data.phase === 'ended' || data.phase === 'timeout') {
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
      <div className="mt-6 p-5 rounded-2xl border border-[#1f6b67]/30 bg-[#1f6b67]/5">
        <p className="text-sm font-bold text-[#1f6b67]">Vote enregistré</p>
        <p className="mt-2 text-sm text-[#706b63] dark:text-[#a49f96] leading-relaxed">
          En attente de la réponse de l’autre personne. Son choix reste secret
          jusqu’à ce que les deux aient répondu.
        </p>
      </div>
    );
  }

  if (phase === 'extended') {
    return (
      <div className="mt-6 p-5 rounded-2xl border border-[#1f6b67]/30 bg-[#1f6b67]/10">
        <p className="text-sm font-bold text-[#1f6b67]">Pacte prolongé</p>
        <p className="mt-2 text-sm text-[#706b63] dark:text-[#a49f96] leading-relaxed">
          Vous avez tous les deux accepté. +7 jours. L’historique est conservé.
        </p>
      </div>
    );
  }

  if (phase === 'ended' || phase === 'timeout') {
    return (
      <div className="mt-6 p-5 rounded-2xl border border-black/10 bg-[#f2eee5] dark:bg-white/5">
        <p className="text-sm font-bold">Pacte terminé</p>
        <p className="mt-2 text-sm text-[#706b63] dark:text-[#a49f96] leading-relaxed">
          Merci pour le temps partagé. Ce n’est pas un échec. Tu peux recommencer
          un nouveau pacte quand tu veux.
        </p>
      </div>
    );
  }

  // phase === 'prompt'
  const endLabel = endsAt
    ? new Date(endsAt).toLocaleString('fr-FR', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
      })
    : '';

  return (
    <div className="mt-6 p-5 rounded-2xl border-2 border-[#1f6b67]/40 bg-white dark:bg-white/5 shadow-sm">
      <p className="text-xs uppercase tracking-wide text-[#1f6b67] font-bold">
        Fin de cycle
      </p>
      <h2 className="mt-2 text-lg font-serif">Prolonger de 7 jours ?</h2>
      <p className="mt-2 text-sm text-[#706b63] dark:text-[#a49f96] leading-relaxed">
        Le pacte{endLabel ? ` se termine autour du ${endLabel}` : ' arrive à sa fin'}.
        Si <strong>vous deux</strong> répondez oui, vous continuez une semaine de
        plus avec le même historique. Si l’un dit non (ou ne répond pas), le pacte
        se clôture en douceur.
      </p>
      <p className="mt-2 text-xs text-[#a49f96]">
        Ton vote reste secret jusqu’à la réponse de l’autre.
      </p>

      {error && (
        <p className="mt-3 text-sm text-red-600">{error}</p>
      )}

      <div className="mt-5 grid grid-cols-2 gap-3">
        <button
          type="button"
          disabled={sending}
          onClick={() => vote('yes')}
          className="py-3 rounded-full bg-[#1f6b67] text-white font-bold hover:bg-[#184f4d] disabled:opacity-50"
        >
          Oui
        </button>
        <button
          type="button"
          disabled={sending}
          onClick={() => vote('no')}
          className="py-3 rounded-full border border-black/15 font-bold hover:bg-black/5 disabled:opacity-50"
        >
          Non
        </button>
      </div>
    </div>
  );
}
