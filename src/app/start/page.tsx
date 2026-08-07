'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function StartPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [duration, setDuration] = useState<'1' | '3' | '7'>('3');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState<{
    emailSent: boolean;
    warning: string | null;
    pactId: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          durationDays: Number(duration),
          forceNew: false,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        const parts = [data.error, data.detail].filter(Boolean);
        throw new Error(parts.join(' — ') || 'Une erreur est survenue');
      }

      localStorage.setItem('pacte_email', email.toLowerCase().trim());
      localStorage.setItem('pacte_duration', duration);
      if (data.userId) localStorage.setItem('pacte_userId', data.userId);
      if (data.pactId) localStorage.setItem('pacte_pactId', data.pactId);

      if (typeof Notification !== 'undefined' && Notification.permission === 'default') {
        Notification.requestPermission().catch(() => {});
      }

      if (data.resume && data.pactId) {
        router.push(`/pact/${data.pactId}`);
        return;
      }

      setDone({
        emailSent: !!data.emailSent,
        warning: data.emailWarning || null,
        pactId: data.pactId,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <main className="min-h-screen grid place-items-center px-4 py-16">
        <div className="max-w-md w-full text-center animate-fade-up">
          <h1 className="font-serif text-3xl tracking-tight">
            {done.emailSent ? 'Lien envoyé' : 'Pacte prêt'}
          </h1>
          <p className="mt-3 leading-relaxed" style={{ color: 'var(--muted)' }}>
            {done.emailSent
              ? 'Vérifie ta boîte mail. Tu peux aussi continuer tout de suite.'
              : done.warning || 'Tu peux entrer en attente immédiatement.'}
          </p>
          <button
            type="button"
            onClick={() => router.push('/waiting')}
            className="btn-primary mt-8 w-full"
          >
            Continuer vers l’attente
          </button>
          <Link href="/" className="mt-8 inline-block text-sm" style={{ color: 'var(--muted)' }}>
            ← Accueil
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen py-12 md:py-16">
      <div className="max-w-md mx-auto px-4 w-full animate-fade-up">
        <Link href="/" className="text-sm" style={{ color: 'var(--muted)' }}>
          ← Retour
        </Link>
        <h1 className="mt-6 font-serif text-3xl md:text-4xl tracking-tight">
          Commencer un pacte de présence
        </h1>
        <p className="mt-2 text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>
          Tu n’as pas besoin de tout expliquer. Juste choisir une durée et
          rester un peu avec quelqu’un — discrètement.
        </p>

        <div className="card-premium mt-8 p-5">
          <p className="text-sm font-semibold" style={{ color: 'var(--accent)' }}>
            Ce n’est pas un test
          </p>
          <p className="mt-2 text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>
            Que tu aies besoin d’une présence, que tu veuilles en offrir une, ou
            les deux : même parcours. Il n’y a pas de bonne ou de mauvaise
            raison d’être ici.
          </p>
        </div>

        <div
          className="mt-3 p-5 rounded-[var(--radius)] border"
          style={{
            borderColor: 'color-mix(in srgb, var(--accent) 22%, transparent)',
            background: 'var(--accent-soft)',
          }}
        >
          <p className="text-sm font-semibold">Ce qui est garanti</p>
          <ul className="mt-2 text-sm space-y-1.5" style={{ color: 'var(--muted)' }}>
            <li>· Aucun échange libre (pas de chat)</li>
            <li>· Aucun nom réel nécessaire</li>
            <li>· Historique conservé tant que le pacte est actif</li>
            <li>· Échanges illimités pendant la durée</li>
            <li>· Arrêt possible à tout moment</li>
          </ul>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div>
            <label className="block text-sm font-semibold mb-2.5">Durée</label>
            <div className="grid grid-cols-3 gap-2.5">
              {(['1', '3', '7'] as const).map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setDuration(d)}
                  className="py-3.5 rounded-xl border text-sm font-semibold"
                  style={
                    duration === d
                      ? {
                          background: 'var(--accent)',
                          color: '#fff',
                          borderColor: 'var(--accent)',
                        }
                      : {
                          background: 'var(--card)',
                          borderColor: 'var(--border)',
                        }
                  }
                >
                  {d} jour{Number(d) > 1 ? 's' : ''}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2.5">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3.5 rounded-xl border text-sm"
              style={{
                borderColor: 'var(--border)',
                background: 'var(--card-solid)',
              }}
              placeholder="ton@email.com"
              autoComplete="email"
            />
            <p className="mt-2 text-xs" style={{ color: 'var(--muted)' }}>
              Si un pacte actif existe avec cet email, tu le reprends avec
              l’historique.
            </p>
          </div>

          {error && (
            <p className="text-sm text-red-600 dark:text-red-400 break-words">{error}</p>
          )}

          <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-60">
            {loading ? 'Chargement…' : 'Continuer'}
          </button>
        </form>

        <p className="mt-8 text-xs text-center leading-relaxed" style={{ color: 'var(--muted)' }}>
          En continuant :{' '}
          <Link href="/cgu" className="underline">
            conditions
          </Link>{' '}
          ·{' '}
          <Link href="/confidentialite" className="underline">
            confidentialité
          </Link>
        </p>
      </div>
    </main>
  );
}
