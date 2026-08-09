'use client';

import { useEffect, useState, Suspense, useRef, useCallback } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import {
  readSession,
  writeSession,
  resolveAndSyncSession,
  clearSession,
} from '@/lib/session';
import { subscribePactMatch } from '@/lib/realtime';

function nextPollMs(attempt: number, realtimeOk: boolean) {
  if (realtimeOk) return attempt < 5 ? 4000 : 8000;
  if (attempt < 10) return 1200;
  if (attempt < 25) return 2000;
  return 4000;
}

function WaitingContent() {
  const [email, setEmail] = useState<string | null>(null);
  const [duration, setDuration] = useState<string | null>(null);
  const [waitingTime, setWaitingTime] = useState('00:00');
  const [status, setStatus] = useState('Recherche d’une présence…');
  const [pactId, setPactId] = useState<string | null>(null);
  const [hint, setHint] = useState<string | null>(null);
  const [alone, setAlone] = useState(true);
  const [leaving, setLeaving] = useState(false);
  const [offline, setOffline] = useState(false);
  const [live, setLive] = useState(false);
  const [honest, setHonest] = useState(
    'Rien ne se passe tant qu’une autre personne n’a pas choisi la même durée et ouvert l’attente.'
  );

  const attemptRef = useRef(0);
  const leftRef = useRef(false);
  const pactIdRef = useRef<string | null>(null);
  const liveRef = useRef(false);

  const goToPact = useCallback((activeId: string) => {
    if (leftRef.current) return;
    leftRef.current = true;
    setStatus('Présence trouvée. Ouverture…');
    setAlone(false);
    writeSession({ pactId: activeId, status: 'ACTIVE' });
    window.location.assign(`/pact/${activeId}`);
  }, []);

  const signalDisconnect = useCallback((id: string | null) => {
    if (!id || leftRef.current) return;
    leftRef.current = true;
    const body = JSON.stringify({ pactId: id, action: 'disconnect' });
    try {
      if (navigator.sendBeacon) {
        navigator.sendBeacon(
          '/api/match',
          new Blob([body], { type: 'application/json' })
        );
        return;
      }
    } catch {
      /* ignore */
    }
    fetch('/api/match', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
      keepalive: true,
    }).catch(() => {});
  }, []);

  useEffect(() => {
    const s = readSession();
    setEmail(s.email || null);
    setDuration(s.duration || null);
    setPactId(s.pactId || null);
    pactIdRef.current = s.pactId || null;

    if (!s.pactId && s.email) {
      resolveAndSyncSession(s.email).then((r) => {
        if (r.pactId) {
          setPactId(r.pactId);
          pactIdRef.current = r.pactId;
          if (r.status === 'ACTIVE') goToPact(r.pactId);
        }
      });
    }

    let seconds = 0;
    const timer = setInterval(() => {
      seconds++;
      setWaitingTime(
        `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`
      );
      if (seconds === 45) {
        setHonest(
          'Toujours seul(e) : c’est normal s’il n’y a personne d’autre connecté en même temps.'
        );
      }
      if (seconds === 150) {
        setHonest(
          'Tu peux laisser cette page ouverte, ou revenir plus tard avec le même email et la même durée.'
        );
      }
    }, 1000);

    const onOffline = () => {
      setOffline(true);
      setStatus('Connexion perdue. Reprise automatique…');
    };
    const onOnline = () => {
      setOffline(false);
      setStatus('Réseau de retour. Recherche en cours…');
    };
    const onPageHide = () => signalDisconnect(pactIdRef.current);

    window.addEventListener('offline', onOffline);
    window.addEventListener('online', onOnline);
    window.addEventListener('pagehide', onPageHide);

    return () => {
      clearInterval(timer);
      window.removeEventListener('offline', onOffline);
      window.removeEventListener('online', onOnline);
      window.removeEventListener('pagehide', onPageHide);
    };
  }, [signalDisconnect, goToPact]);

  useEffect(() => {
    pactIdRef.current = pactId;
  }, [pactId]);

  useEffect(() => {
    if (!pactId) return;
    setLive(false);
    liveRef.current = false;

    const unsub = subscribePactMatch(pactId, (activeId) => {
      goToPact(activeId);
    });

    const t = setTimeout(() => {
      setLive(true);
      liveRef.current = true;
      setStatus((s) =>
        s.startsWith('Présence') ? s : 'Temps réel actif — en écoute…'
      );
    }, 600);

    return () => {
      clearTimeout(t);
      unsub();
    };
  }, [pactId, goToPact]);

  useEffect(() => {
    if (!pactId) return;

    let cancelled = false;
    let timer: ReturnType<typeof setTimeout>;
    attemptRef.current = 0;

    const schedule = () => {
      if (cancelled || leftRef.current) return;
      timer = setTimeout(
        tryMatch,
        nextPollMs(attemptRef.current, liveRef.current)
      );
    };

    const tryMatch = async () => {
      if (cancelled || leftRef.current) return;
      if (typeof navigator !== 'undefined' && !navigator.onLine) {
        setOffline(true);
        schedule();
        return;
      }

      try {
        const res = await fetch('/api/match', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ pactId, action: 'match' }),
        });
        const data = await res.json();
        if (cancelled || leftRef.current) return;

        if (data.matched && data.pactId) {
          goToPact(data.pactId);
          return;
        }

        setAlone(data.alone !== false);
        if (!liveRef.current) {
          setStatus(
            data.message ||
              (data.alone !== false
                ? 'Tu es seul(e) dans la file pour l’instant.'
                : 'Toujours en attente…')
          );
        }
        writeSession({ status: 'WAITING' });
        if (data.debug) {
          setHint(
            `Durée : ${data.debug.myDuration} j · File : ${data.debug.totalWaiting} · Actifs même durée : ${data.debug.livePartners ?? data.debug.sameDurationOthers ?? 0}`
          );
        }
      } catch {
        if (!cancelled) setStatus('Connexion en cours…');
      }

      attemptRef.current += 1;
      schedule();
    };

    tryMatch();
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [pactId, goToPact]);

  const leaveQueue = async () => {
    if (!pactId || leaving) return;
    setLeaving(true);
    leftRef.current = true;
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
      <Header showCta={false} />
      <section className="flex-1 grid place-items-center py-12 md:py-16 pact-shell">
        <div className="max-w-md mx-auto px-4 text-center w-full">
          <div className="mx-auto mb-7 flex justify-center">
            <div className="pact-breath" />
          </div>

          <p className="section-label">File d’attente</p>
          <h1 className="mt-3 font-serif text-3xl tracking-tight">En attente</h1>
          <p
            className="mt-3 text-sm leading-relaxed max-w-[34ch] mx-auto"
            style={{ color: 'var(--muted)' }}
          >
            Pacte
            {duration
              ? ` de ${duration} jour${Number(duration) > 1 ? 's' : ''}`
              : ''}
            . Le lien se crée seulement si une autre personne est active avec la
            même durée.
          </p>

          <div className="mt-5 flex flex-wrap justify-center gap-2 text-[11px]">
            {live && (
              <span
                className="px-2.5 py-1 rounded-full font-semibold"
                style={{
                  background: 'var(--accent-soft)',
                  color: 'var(--accent)',
                }}
              >
                Temps réel
              </span>
            )}
            {offline && (
              <span
                className="px-2.5 py-1 rounded-full font-semibold"
                style={{ color: 'var(--muted)' }}
              >
                Hors ligne
              </span>
            )}
          </div>

          <div className="card-premium mt-8 p-7">
            <div
              className="text-[10px] uppercase tracking-[0.14em] font-semibold mb-2"
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
            <p
              className="mt-4 text-sm leading-relaxed"
              style={{ color: 'var(--muted)' }}
            >
              {status}
            </p>
            {hint && (
              <p className="mt-2 text-xs" style={{ color: 'var(--muted)' }}>
                {hint}
              </p>
            )}
            {alone && (
              <p
                className="mt-4 text-[11px] font-semibold tracking-wide"
                style={{ color: 'var(--accent)' }}
              >
                File : toi seul(e) pour le moment
              </p>
            )}
          </div>

          <p
            className="mt-6 text-xs leading-relaxed max-w-[36ch] mx-auto"
            style={{ color: 'var(--muted)' }}
          >
            {honest}
          </p>

          {!pactId && (
            <div
              className="mt-6 p-4 rounded-xl border text-sm text-left"
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
            className="mt-8 text-left text-xs space-y-2 p-5 rounded-2xl"
            style={{ background: 'var(--mist)', color: 'var(--muted)' }}
          >
            <p className="font-semibold" style={{ color: 'var(--accent)' }}>
              Pour que le lien se fasse
            </p>
            <p>· Deux appareils (ou deux emails différents)</p>
            <p>· La même durée : 1, 3 ou 7 jours</p>
            <p>· Les deux restent sur cette page</p>
          </div>

          {email && (
            <p className="mt-5 text-xs" style={{ color: 'var(--muted)' }}>
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
                className="btn-ghost !text-sm min-h-[44px]"
              >
                {leaving ? 'Sortie…' : 'Annuler l’attente'}
              </button>
            )}
            <Link href="/" className="text-sm min-h-[44px] grid place-items-center" style={{ color: 'var(--muted)' }}>
              Accueil
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
