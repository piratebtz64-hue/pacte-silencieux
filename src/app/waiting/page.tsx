'use client';

import { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { readSession, writeSession, resolveAndSyncSession } from '@/lib/session';

function WaitingContent() {
  const [email, setEmail] = useState<string | null>(null);
  const [duration, setDuration] = useState<string | null>(null);
  const [waitingTime, setWaitingTime] = useState('00:00');
  const [status, setStatus] = useState('Recherche d’une présence…');
  const [pactId, setPactId] = useState<string | null>(null);
  const [hint, setHint] = useState<string | null>(null);
  const [honest, setHonest] = useState(
    'Le match peut prendre quelques secondes… ou plusieurs minutes, selon qui est en ligne.'
  );

  useEffect(() => {
    const s = readSession();
    setEmail(s.email || null);
    setDuration(s.duration || null);
    setPactId(s.pactId || null);

    // Si pas de pactId mais email → résoudre
    if (!s.pactId && s.email) {
      resolveAndSyncSession(s.email).then((r) => {
        if (r.pactId) {
          setPactId(r.pactId);
          if (r.status === 'ACTIVE') {
            window.location.assign(`/pact/${r.pactId}`);
          }
        }
      });
    }

    let seconds = 0;
    const timer = setInterval(() => {
      seconds++;
      const m = Math.floor(seconds / 60);
      const s2 = seconds % 60;
      setWaitingTime(
        `${String(m).padStart(2, '0')}:${String(s2).padStart(2, '0')}`
      );
      if (seconds === 60) {
        setHonest(
          'Toujours personne ? Souvent la même durée manque de l’autre côté. Garde cette page ouverte.'
        );
      }
      if (seconds === 180) {
        setHonest(
          'Trois minutes : c’est normal si peu de monde est connecté. Tu peux revenir plus tard avec le même email.'
        );
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!pactId) return;

    let cancelled = false;

    const tryMatch = async () => {
      try {
        const res = await fetch('/api/match', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ pactId }),
        });
        const data = await res.json();
        if (cancelled) return;

        if (data.matched && data.pactId) {
          setStatus('Présence trouvée. Ouverture…');
          writeSession({ pactId: data.pactId, status: 'ACTIVE' });
          window.location.assign(`/pact/${data.pactId}`);
          return;
        }

        setStatus(data.message || 'Toujours en attente…');
        writeSession({ status: 'WAITING' });
        if (data.debug) {
          setHint(
            `Ta durée : ${data.debug.myDuration} j · Personnes en attente : ${data.debug.totalWaiting}`
          );
        }
      } catch {
        if (!cancelled) setStatus('Connexion en cours…');
      }
    };

    tryMatch();
    const interval = setInterval(tryMatch, 3000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [pactId]);

  return (
    <main className="min-h-screen flex flex-col">
      <Header />
      <section className="flex-1 grid place-items-center py-16 pact-shell">
        <div className="max-w-md mx-auto px-4 text-center">
          <div className="mx-auto mb-6 flex justify-center">
            <div className="pact-breath" />
          </div>

          <h1 className="font-serif text-3xl tracking-tight">En attente</h1>
          <p
            className="mt-3 text-sm leading-relaxed max-w-[32ch] mx-auto"
            style={{ color: 'var(--muted)' }}
          >
            Pacte
            {duration
              ? ` de ${duration} jour${Number(duration) > 1 ? 's' : ''}`
              : ''}
            . On cherche une présence avec la même durée.
          </p>

          <div
            className="mt-8 p-6 rounded-2xl border"
            style={{
              background: 'var(--card-solid)',
              borderColor: 'var(--border)',
            }}
          >
            <div className="text-xs tracking-wide mb-2" style={{ color: 'var(--muted)' }}>
              Temps d’attente
            </div>
            <div
              className="text-4xl font-serif tabular-nums"
              style={{ color: 'var(--accent)' }}
            >
              {waitingTime}
            </div>
            <p className="mt-3 text-sm" style={{ color: 'var(--muted)' }}>
              {status}
            </p>
            {hint && (
              <p className="mt-2 text-xs" style={{ color: 'var(--muted)' }}>
                {hint}
              </p>
            )}
          </div>

          <p
            className="mt-5 text-xs leading-relaxed max-w-[36ch] mx-auto"
            style={{ color: 'var(--muted)' }}
          >
            {honest}
          </p>

          {!pactId && (
            <div
              className="mt-6 p-4 rounded-xl border text-sm"
              style={{
                borderColor: 'color-mix(in srgb, var(--gold) 40%, transparent)',
                background: 'var(--gold-soft)',
              }}
            >
              Aucune session sur cet appareil.{' '}
              <Link href="/start" className="underline font-bold">
                Commencer un pacte
              </Link>
            </div>
          )}

          <div
            className="mt-8 text-left text-xs space-y-2 p-4 rounded-xl"
            style={{ background: 'var(--accent-soft)', color: 'var(--muted)' }}
          >
            <p className="font-semibold" style={{ color: 'var(--accent)' }}>
              Pour que le match fonctionne
            </p>
            <p>· Deux emails différents</p>
            <p>· La même durée (1, 3 ou 7 jours)</p>
            <p>· Les deux pages d’attente ouvertes</p>
          </div>

          {email && (
            <p className="mt-4 text-xs" style={{ color: 'var(--muted)' }}>
              Cet appareil : <strong>{email}</strong>
              {duration ? ` · ${duration} j` : ''}
            </p>
          )}

          <Link
            href="/"
            className="mt-8 inline-block text-sm"
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

export default function WaitingPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen grid place-items-center">
          <div className="pact-breath" />
        </main>
      }
    >
      <WaitingContent />
    </Suspense>
  );
}
