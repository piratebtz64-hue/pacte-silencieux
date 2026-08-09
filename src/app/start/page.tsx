'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { readSession, writeSession } from '@/lib/session';

export default function StartPage() {
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

  const goAfterStart = (data: {
    status?: string;
    pactId?: string;
    resume?: boolean;
  }) => {
    if (data.status === 'ACTIVE' && data.pactId) {
      window.location.assign(`/pact/${data.pactId}`);
      return true;
    }
    if (data.resume && data.status === 'WAITING') {
      window.location.assign('/waiting');
      return true;
    }
    return false;
  };

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
        throw new Error(
          [data.error, data.detail].filter(Boolean).join(' — ') || 'Erreur'
        );
      }

      writeSession({
        email: mail,
        userId: data.userId || '',
        pactId: data.pactId || '',
        duration: String(duration),
        status: data.status || 'WAITING',
      });

      if (goAfterStart(data)) return;
      if (data.pactId) {
        window.location.assign('/waiting');
        return;
      }
      setError('Aucun pacte trouvé. Utilise Continuer pour en créer un.');
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
        status: data.status || 'WAITING',
      });

      if (
        typeof Notification !== 'undefined' &&
        Notification.permission === 'default'
      ) {
        Notification.requestPermission().catch(() => {});
      }

      if (goAfterStart(data)) return;

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
      <main className="min-h-screen flex flex-col">
        <Header showCta={false} />
        <section className="flex-1 grid place-items-center px-4 py-16">
          <div className="max-w-md w-full text-center animate-fade-up">
            <div className="flex justify-center mb-6">
              <div className="pact-breath" />
            </div>
            <p className="section-label">Presque là</p>
            <h1 className="mt-3 font-serif text-3xl tracking-tight">
              {done.emailSent ? 'Lien envoyé' : 'Pacte prêt'}
            </h1>
            <p
              className="mt-4 leading-relaxed text-sm"
              style={{ color: 'var(--muted)' }}
            >
              {done.emailSent
                ? 'Vérifie ta boîte mail. Tu peux aussi continuer tout de suite vers l’attente.'
                : done.warning ||
                  'Tu peux entrer en attente immédiatement.'}
            </p>
            <p
              className="mt-3 text-xs leading-relaxed"
              style={{ color: 'var(--muted)' }}
            >
              Pour matcher : second téléphone ou second email, même durée, page
              d’attente ouverte des deux côtés.
            </p>
            <button
              type="button"
              onClick={() => window.location.assign('/waiting')}
              className="btn-primary mt-8 w-full min-h-[48px]"
            >
              Continuer vers l’attente
            </button>
            <Link
              href="/outils?outil=coherence"
              className="mt-4 inline-block text-sm"
              style={{ color: 'var(--accent)' }}
            >
              Ou respirer en attendant →
            </Link>
            <Link
              href="/"
              className="mt-6 inline-block text-sm"
              style={{ color: 'var(--muted)' }}
            >
              ← Accueil
            </Link>
          </div>
        </section>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col">
      <Header showCta={false} />
      <section className="flex-1 py-10 md:py-14">
        <div className="max-w-md mx-auto px-4 w-full animate-fade-up">
          <p className="section-label">Pacte</p>
          <h1 className="mt-3 font-serif text-3xl md:text-[2.35rem] tracking-tight leading-tight">
            Une présence, pour un temps limité
          </h1>
          <p
            className="mt-3 text-sm leading-relaxed"
            style={{ color: 'var(--muted)' }}
          >
            Gestes et messages déjà écrits · pas de chat libre · 1, 3 ou 7 jours.
            Ce n’est pas un soin médical ni une urgence.
          </p>

          {hasSession && (
            <div
              className="mt-6 p-5 rounded-2xl border text-sm"
              style={{
                borderColor: 'color-mix(in srgb, var(--accent) 28%, transparent)',
                background: 'var(--accent-soft)',
              }}
            >
              <p className="font-semibold" style={{ color: 'var(--accent)' }}>
                Session sur cet appareil
              </p>
              <p className="mt-1.5" style={{ color: 'var(--muted)' }}>
                Même email qu’à l’inscription pour rouvrir ton pacte ou
                l’attente.
              </p>
              <button
                type="button"
                disabled={resuming || !email}
                onClick={resumePact}
                className="mt-3 font-bold underline disabled:opacity-50 min-h-[44px]"
                style={{ color: 'var(--accent)' }}
              >
                {resuming ? 'Ouverture…' : 'Ouvrir mon pacte →'}
              </button>
            </div>
          )}

          <div className="card-premium mt-7 p-5">
            <p className="text-sm font-semibold" style={{ color: 'var(--accent)' }}>
              Pour que le lien se fasse
            </p>
            <ul
              className="mt-2 text-sm space-y-1.5 leading-relaxed"
              style={{ color: 'var(--muted)' }}
            >
              <li>· Deux personnes (deux emails ou deux appareils)</li>
              <li>· La même durée choisie</li>
              <li>· Les deux restent sur la page d’attente</li>
            </ul>
          </div>

          <div
            className="mt-4 p-4 rounded-2xl text-xs leading-relaxed text-left"
            style={{ background: 'var(--mist)', color: 'var(--muted)' }}
          >
            <p className="font-semibold" style={{ color: 'var(--accent)' }}>
              Astuce : tester en 2 minutes
            </p>
            <p className="mt-1.5">
              Second téléphone + autre email + même durée + les deux sur « En
              attente ». Le match s’ouvre tout seul.
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
                    className="py-3.5 min-h-[48px] rounded-xl border text-sm font-semibold touch-manipulation"
                    style={
                      duration === d
                        ? {
                            background: 'var(--accent)',
                            color: '#fff',
                            borderColor: 'var(--accent)',
                          }
                        : {
                            background: 'var(--card-solid)',
                            borderColor: 'var(--border)',
                          }
                    }
                  >
                    {d} j
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
                className="w-full px-4 py-3.5 min-h-[48px] rounded-xl border text-sm"
                style={{
                  borderColor: 'var(--border)',
                  background: 'var(--card-solid)',
                }}
                placeholder="ton@email.com"
                autoComplete="email"
              />
              <p className="mt-2 text-xs" style={{ color: 'var(--muted)' }}>
                Même email = reprise du pacte et de l’historique.
              </p>
            </div>

            {error && (
              <p className="text-sm text-red-600 dark:text-red-400 break-words">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full min-h-[48px] disabled:opacity-60"
            >
              {loading ? 'Chargement…' : 'Continuer'}
            </button>
          </form>

          <p
            className="mt-8 text-xs text-center leading-relaxed"
            style={{ color: 'var(--muted)' }}
          >
            En continuant :{' '}
            <Link href="/cgu" className="underline">
              conditions
            </Link>{' '}
            ·{' '}
            <Link href="/confidentialite" className="underline">
              confidentialité
            </Link>
            {' '}· En détresse : 3114 · 15 · 112
          </p>
        </div>
      </section>
      <Footer />
    </main>
  );
}
