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
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, durationDays: Number(duration) }),
      });

      if (!res.ok) {
        const text = await res.text();
        console.error('Erreur API:', text);
        throw new Error('Erreur lors de la soumission');
      }

      const data: { userId?: string } = await res.json();

      localStorage.setItem('pacte_email', email.toLowerCase().trim());
      localStorage.setItem('pacte_duration', duration);
      if (data.userId) localStorage.setItem('pacte_userId', data.userId);

      setSent(true);

      setTimeout(() => {
        router.push('/waiting');
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <main className="min-h-screen grid place-items-center">
        <div className="max-w-md mx-auto px-4 text-center">
          <div className="text-4xl mb-4">✉️</div>
          <h1 className="text-2xl font-serif">Lien magique envoyé</h1>
          <p className="mt-2 text-[#706b63] dark:text-[#a49f96]">
            Vérifie ta boîte mail (et les spams). Clique sur le lien pour
            confirmer et entrer en attente d’appairage.
          </p>
          <p className="mt-6 text-sm text-[#a49f96]">
            Redirection automatique…
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen grid place-items-center">
      <div className="max-w-md mx-auto px-4 w-full">
        <Link
          href="/"
          className="text-sm text-[#706b63] dark:text-[#a49f96] hover:underline"
        >
          ← Retour
        </Link>
        <h1 className="mt-6 text-3xl font-serif">Commencer un pacte</h1>
        <p className="mt-2 text-[#706b63] dark:text-[#a49f96]">
          Choisis une durée et entre ton email pour recevoir un lien magique.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div>
            <label className="block text-sm font-bold mb-2">Durée</label>
            <div className="grid grid-cols-3 gap-2">
              {(['1', '3', '7'] as const).map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setDuration(d)}
                  className={`py-3 rounded-lg border transition ${
                    duration === d
                      ? 'bg-[#1f6b67] text-white border-[#1f6b67]'
                      : 'bg-white dark:bg-white/5 border-black/10 dark:border-white/10 hover:border-[#1f6b67]/40'
                  }`}
                >
                  {d} jour{Number(d) > 1 ? 's' : ''}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-lg border border-black/10 dark:border-white/10 bg-white dark:bg-white/5 focus:outline-none focus:ring-2 focus:ring-[#1f6b67]/40"
              placeholder="ton@email.com"
              autoComplete="email"
            />
          </div>

          {error && (
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg bg-[#1f6b67] text-white font-bold hover:bg-[#184f4d] transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? 'Envoi en cours…' : 'Recevoir le lien magique'}
          </button>
        </form>

        <p className="mt-6 text-xs text-[#a49f96] text-center leading-relaxed">
          Aucun profil public. Ton email sert uniquement à t’authentifier et à
          te reconnecter à ton pacte. Il n’est jamais partagé.
        </p>
      </div>
    </main>
  );
}
