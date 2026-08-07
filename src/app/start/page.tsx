'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function StartPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mode, setMode] = useState<'register' | 'login'>('register');
  const [duration, setDuration] = useState<'1' | '3' | '7'>('3');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState<{
    emailSent: boolean;
    warning: string | null;
    pactId: string;
  } | null>(null);

  const unlockSession = async () => {
    const res = await fetch('/api/auth/password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, mode }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Erreur mot de passe');
    if (data.userId) localStorage.setItem('pacte_userId', data.userId);
    localStorage.setItem('pacte_unlocked', '1');
    localStorage.setItem('pacte_email', email.toLowerCase().trim());
    return data;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // 1. Mot de passe obligatoire
      await unlockSession();

      // 2. Login seul → reprendre pacte si possible
      if (mode === 'login') {
        const startRes = await fetch('/api/start', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email,
            durationDays: Number(duration),
            forceNew: false,
          }),
        });
        const startData = await startRes.json();
        if (!startRes.ok) throw new Error(startData.error || 'Erreur');
        if (startData.userId) localStorage.setItem('pacte_userId', startData.userId);
        if (startData.pactId) localStorage.setItem('pacte_pactId', startData.pactId);
        if (startData.resume && startData.pactId) {
          router.push(`/pact/${startData.pactId}`);
          return;
        }
        setDone({
          emailSent: !!startData.emailSent,
          warning: startData.emailWarning || null,
          pactId: startData.pactId,
        });
        return;
      }

      // 3. Nouveau pacte
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
      if (!res.ok) throw new Error(data.error || 'Une erreur est survenue');

      localStorage.setItem('pacte_duration', duration);
      if (data.userId) localStorage.setItem('pacte_userId', data.userId);
      if (data.pactId) localStorage.setItem('pacte_pactId', data.pactId);

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
          {mode === 'register' ? 'Créer un pacte protégé' : 'Se reconnecter'}
        </h1>
        <p className="mt-2 text-sm" style={{ color: 'var(--muted)' }}>
          Email + mot de passe · anonymat conservé
        </p>

        <div className="mt-6 flex gap-2 p-1 rounded-full border" style={{ borderColor: 'var(--border)' }}>
          <button
            type="button"
            onClick={() => setMode('register')}
            className="flex-1 py-2 rounded-full text-sm font-semibold"
            style={
              mode === 'register'
                ? { background: 'var(--accent)', color: '#fff' }
                : { color: 'var(--muted)' }
            }
          >
            Nouveau
          </button>
          <button
            type="button"
            onClick={() => setMode('login')}
            className="flex-1 py-2 rounded-full text-sm font-semibold"
            style={
              mode === 'login'
                ? { background: 'var(--accent)', color: '#fff' }
                : { color: 'var(--muted)' }
            }
          >
            Se connecter
          </button>
        </div>

        <div
          className="mt-6 p-4 rounded-[var(--radius)] border text-sm leading-relaxed"
          style={{
            borderColor: 'color-mix(in srgb, var(--accent) 22%, transparent)',
            background: 'var(--accent-soft)',
            color: 'var(--muted)',
          }}
        >
          {mode === 'register'
            ? 'Choisis un mot de passe (min. 6 caractères). Il protégera ton profil et l’accès à ton historique.'
            : 'Entre le même email et mot de passe pour retrouver ton pacte actif et tes messages.'}
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          {mode === 'register' && (
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
          )}

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
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2.5">Mot de passe</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full px-4 py-3.5 rounded-xl border text-sm"
              style={{
                borderColor: 'var(--border)',
                background: 'var(--card-solid)',
              }}
              placeholder="••••••••"
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
            />
          </div>

          {error && (
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          )}

          <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-60">
            {loading
              ? 'Chargement…'
              : mode === 'login'
                ? 'Se connecter'
                : 'Créer et protéger mon pacte'}
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
