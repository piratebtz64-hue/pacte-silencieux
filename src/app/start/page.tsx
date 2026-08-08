'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { readSession, writeSession } from '@/lib/session';

export default function StartPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [duration, setDuration] = useState<'1' | '3' | '7'>('3');
  const [loading, setLoading] = useState(false);
  const [resuming, setResuming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSession, setHasSession] = useState(false);
  const [done, setDone] = useState<{
    emailSent: boolean;
    warning: string | null;
    pactId: string;
  } | null>(null);

  useEffect(() => {
    const s = readSession();
    if (s.email) setEmail(s.email);
    if (s.duration === '1' || s.duration === '3' || s.duration === '7') {
      setDuration(s.duration);
    }
    if (s.email || s.pactId || s.userId) setHasSession(true);
  }, []);

  /** Toujours passer par l’API pour trouver le VRAI pacte (actif ou attente) */
  const resumePact = async () => {
    const mail = email.toLowerCase().trim();
    if (!mail) {
      setError('Indique le même email que lors de l’inscription.');
      return;
    }
    setResuming(true);
    setError(null);
    try {
      const res = await fetch('/api/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: mail,
          durationDays: Number(duration) || 3,
          forceNew: false,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error([data.error, data.detail].filter(Boolean).join(' — ') || 'Erreur');
      }

      writeSession({
        email: mail,
        userId: data.userId || '',
        pactId: data.pactId || '',
        duration: String(duration),
      });

      if (data.resume && data.status === 'ACTIVE' && data.pactId) {
        router.push(`/pact/${data.pactId}`);
        return;
      }
      if (data.resume && data.status === 'WAITING') {
        router.push('/waiting');
        return;
      }
      // Pas de pacte à reprendre → on continue le flux normal (nouveau)
      if (data.pactId) {
        setDone({
          emailSent: !!data.emailSent,
          warning:
            data.emailWarning ||
            'Aucun pacte actif trouvé. Un nouveau a été préparé.',
          pactId: data.pactId,
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur');
    } finally {
      setResuming(false);
    }
  };

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

      writeSession({
        email: email.toLowerCase().trim(),
        userId: data.userId || '',
        pactId: data.pactId || '',
        duration,
      });

      if (typeof Notification !== 'undefined' && Notification.permission === 'default') {
        Notification.requestPermission().catch(() => {});
      }

      if (data.resume && data.status === 'ACTIVE' && data.pactId) {
        router.push(`/pact/${data.pactId}`);
        return;
      }
      if (data.resume && data.status === 'WAITING') {
        router.push('/waiting');
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

        {hasSession && (
          <div
            className="mt-6 p-4 rounded-xl border text-sm"
            style={{
              borderColor: 'color-mix(in srgb, var(--accent) 30%, transparent)',
              background: 'var(--accent-soft)',
            }}
          >
            <p className="font-semibold" style={{ color: 'var(--accent)' }}>
              Session trouvée sur cet appareil
            </p>
            <p className="mt-1" style={{ color: 'var(--muted)' }}>
              On retrouve ton pacte actif (ou l’attente) avec le même email — pas
              l’ancien lien expiré.
            </p>
            <button
              type="button"
              disabled={resuming || !email}
              onClick={resumePact}
              className="mt-3 font-bold underline disabled:opacity-50"
              style={{ color: 'var(--accent)' }}
            >
              {resuming ? 'Recherche du pacte…' : 'Ouvrir mon pacte →'}
            </button>
            {!email && (
              <p className="mt-2 text-xs" style={{ color: 'var(--muted)' }}>
                Remplis l’email ci-dessous (le même qu’à l’inscription), puis
                reclique.
              </p>
            )}
          </div>
        )}

        <div className="card-premium mt-8 p-5">
          <p className="text-sm font-semibold" style={{ color: 'var(--accent)' }}>
            Ce n’est pas un test
          </p>
          <p className="mt-2 text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>
            Que tu aies besoin d’une présence, que tu veuilles en offrir une, ou
            les deux : même parcours.
          </p>
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
              Même email = tu reprends le pacte actif et l’historique.
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
