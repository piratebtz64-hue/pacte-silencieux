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
        body: JSON.stringify({ email, durationDays: Number(duration) }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Une erreur est survenue');
      }

      localStorage.setItem('pacte_email', email.toLowerCase().trim());
      localStorage.setItem('pacte_duration', duration);
      if (data.userId) localStorage.setItem('pacte_userId', data.userId);
      if (data.pactId) localStorage.setItem('pacte_pactId', data.pactId);

      if (typeof Notification !== 'undefined' && Notification.permission === 'default') {
        Notification.requestPermission().catch(() => {});
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

  const goWaiting = () => {
    router.push('/waiting');
  };

  if (done) {
    return (
      <main className="min-h-screen grid place-items-center px-4">
        <div className="max-w-md mx-auto text-center">
          <div className="text-4xl mb-4">{done.emailSent ? '✉️' : '✅'}</div>
          <h1 className="text-2xl font-serif">
            {done.emailSent ? 'Lien envoyé par e-mail' : 'Pacte prêt'}
          </h1>

          {done.emailSent ? (
            <p className="mt-3 text-[#706b63] dark:text-[#a49f96] leading-relaxed">
              Vérifie ta boîte mail (et les spams). Tu peux aussi continuer tout
              de suite sans attendre le mail — c’est une option technique, pas
              une obligation d’attendre.
            </p>
          ) : (
            <p className="mt-3 text-[#706b63] dark:text-[#a49f96] leading-relaxed">
              {done.warning ||
                'Tu peux entrer en attente immédiatement, sans cliquer de lien mail.'}
            </p>
          )}

          <button
            type="button"
            onClick={goWaiting}
            className="mt-8 w-full py-3.5 rounded-full bg-[#1f6b67] text-white font-bold hover:bg-[#184f4d] transition"
          >
            Continuer vers l’attente
          </button>

          <p className="mt-4 text-xs text-[#a49f96]">
            Garde cet appareil : ta session est enregistrée ici.
          </p>

          <Link
            href="/"
            className="mt-8 inline-block text-sm text-[#706b63] hover:underline"
          >
            ← Accueil
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen py-10">
      <div className="max-w-md mx-auto px-4 w-full">
        <Link
          href="/"
          className="text-sm text-[#706b63] dark:text-[#a49f96] hover:underline"
        >
          ← Retour
        </Link>
        <h1 className="mt-6 text-3xl font-serif">Commencer un pacte de présence</h1>
        <p className="mt-2 text-[#706b63] dark:text-[#a49f96]">
          Gratuit · anonyme · environ 2 minutes pour démarrer
        </p>

        {/* Rôles */}
        <div className="mt-6 p-4 rounded-2xl border border-black/10 dark:border-white/10 bg-white/60 dark:bg-white/5">
          <p className="text-sm font-bold text-[#1f6b67] mb-2">Ton rôle</p>
          <p className="text-sm text-[#706b63] dark:text-[#a49f96] leading-relaxed">
            Tu peux <strong>avoir besoin d’une présence</strong>,{' '}
            <strong>être présent pour quelqu’un</strong>, ou les deux. Le parcours
            est le même : une seule personne anonyme, la même durée, des messages
            et gestes déjà écrits.
          </p>
        </div>

        {/* Confiance */}
        <div className="mt-4 p-4 rounded-2xl border border-[#1f6b67]/20 bg-[#1f6b67]/5">
          <p className="text-sm font-bold mb-2">Ce qui est garanti</p>
          <ul className="text-sm text-[#706b63] dark:text-[#a49f96] space-y-1.5">
            <li>· Aucun échange libre (pas de chat)</li>
            <li>· Aucun nom réel nécessaire</li>
            <li>· Aucun contact direct entre participants</li>
            <li>· Tu peux arrêter à tout moment</li>
            <li>· Signalement possible à tout moment</li>
          </ul>
        </div>

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
            <p className="mt-1.5 text-xs text-[#a49f96]">
              Sert au lien de connexion. Tu pourras continuer même si le mail
              met du temps à arriver (limite technique possible).
            </p>
          </div>

          {error && (
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-full bg-[#1f6b67] text-white font-bold hover:bg-[#184f4d] transition disabled:opacity-60"
          >
            {loading ? 'Création…' : 'Commencer un pacte de présence'}
          </button>
        </form>

        <p className="mt-6 text-xs text-[#a49f96] text-center leading-relaxed">
          En continuant, tu acceptes les{' '}
          <Link href="/cgu" className="underline">
            conditions d’utilisation
          </Link>{' '}
          et la{' '}
          <Link href="/confidentialite" className="underline">
            confidentialité
          </Link>
          .
        </p>
      </div>
    </main>
  );
}
