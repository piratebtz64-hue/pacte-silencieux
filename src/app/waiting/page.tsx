'use client';

import { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import {
  readSession,
  writeSession,
  resolveAndSyncSession,
  clearSession,
} from '@/lib/session';

function WaitingContent() {
  const [email, setEmail] = useState<string | null>(null);
  const [duration, setDuration] = useState<string | null>(null);
  const [waitingTime, setWaitingTime] = useState('00:00');
  const [status, setStatus] = useState('Recherche d’une présence…');
  const [pactId, setPactId] = useState<string | null>(null);
  const [hint, setHint] = useState<string | null>(null);
  const [alone, setAlone] = useState(true);
  const [leaving, setLeaving] = useState(false);
  const [honest, setHonest] = useState(
    'Rien ne se passe tant qu’une autre personne n’a pas choisi la même durée et ouvert l’attente.'
  );

  useEffect(() => {
    const s = readSession();
    setEmail(s.email || null);
    setDuration(s.duration || null);
    setPactId(s.pactId || null);

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
      if (seconds === 45) {
        setHonest(
          'Toujours seul·e : c’est normal s’il n’y a personne d’autre connecté en même temps.'
        );
      }
      if (seconds === 150) {
        setHonest(
          'Tu peux laisser cette page ouverte, ou revenir plus tard avec le même email et la même durée.'
        );
      }
      if (seconds === 300) {
        setHonest(
          'Cinq minutes : tu peux annuler et réessayer plus tard, ou tester une autre durée si tu es deux à vous coordonner.'
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
          body: JSON.stringify({ pactId, action: 'match' }),
        });
        const data = await res.json();
        if (cancelled) return;

        if (data.matched && data.pactId) {
          setStatus('Présence trouvée. Ouverture…');
          setAlone(false);
          writeSession({ pactId: data.pactId, status: 'ACTIVE' });
          window.location.assign(`/pact/${data.pactId}`);
          return;
        }

        setAlone(data.alone !== false);
        setStatus(
          data.message ||
            (data.alone !== false
              ? 'Tu es seul·e dans la file pour l’instant.'
              : 'Toujours en attente…')
        );
        writeSession({ status: 'WAITING' });
        if (data.debug) {
          setHint(
            `Durée : ${data.debug.myDuration} j · Dans la file : ${data.debug.totalWaiting} · Même durée que toi : ${data.debug.sameDurationOthers ?? 0}`
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

  const leaveQueue = async () => {
    if (!pactId || leaving) return;
    setLeaving(true);
    try {
      await fetch('/api/match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pactId, action: 'leave' }),
      });
    } catch {
      /* ignore */
    }
    clearSession();
    window.location.assign('/');
  };

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
            className="mt-3 text-sm leading-relaxed max-w-[34ch] mx-auto"
            style={{ color: 'var(--muted)' }}
          >
            Pacte
            {duration
              ? ` de ${duration} jour${Number(duration) > 1 ? 's' : ''}`
              : ''}
            . Le lien ne se crée que lorsqu’une autre personne est vraiment en
            file avec la même durée.
          </p>

          <div
            className="mt-8 p-6 rounded-2xl border"
            style={{
              background: 'var(--card-solid)',
              borderColor: alone
                ? 'var(--border)'
                : 'color-mix(in srgb, var(--accent) 35%, var(--border))',
            }}
          >
            <div
              className="text-xs tracking-wide mb-2"
              style={{ color: 'var(--muted)' }}
            >
              Temps d’attente
            </div>
            <div
              className="text-4xl font-serif tabular-nums"
              style={{ color: 'var(--accent)' }}
            >
              {waitingTime}
            </div>
            <p className="mt-3 text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>
              {status}
            </p>
            {hint && (
              <p className="mt-2 text-xs" style={{ color: 'var(--muted)' }}>
                {hint}
              </p>
            )}
            {alone && (
              <p
                className="mt-3 text-[11px] font-semibold tracking-wide"
                style={{ color: 'var(--accent)' }}
              >
                File : toi seul·e pour le moment
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
              Pour que le lien se fasse
            </p>
            <p>· Deux appareils (ou deux emails différents)</p>
            <p>· La même durée : 1, 3 ou 7 jours</p>
            <p>· Les deux restent sur cette page d’attente</p>
          </div>

          {email && (
            <p className="mt-4 text-xs" style={{ color: 'var(--muted)' }}>
              Cet appareil : <strong>{email}</strong>
              {duration ? ` · ${duration} j` : ''}
            </p>
          )}

          <div className="mt-8 flex flex-col items-center gap-3">
            {pactId && (
              <button
                type="button"
                disabled={leaving}
                onClick={leaveQueue}
                className="btn-ghost !text-sm"
              >
                {leaving ? 'Sortie…' : 'Annuler l’attente'}
              </button>
            )}
            <Link href="/" className="text-sm" style={{ color: 'var(--muted)' }}>
              ← Accueil
            </Link>
          </div>
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
