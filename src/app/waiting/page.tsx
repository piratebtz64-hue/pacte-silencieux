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

function nextPollMs(
  attempt: number,
  realtimeOk: boolean,
  alone: boolean
) {
  if (realtimeOk) {
    return alone ? 8000 : 4500;
  }
  if (alone) {
    if (attempt < 5) return 2500;
    if (attempt < 20) return 4000;
    return 6000;
  }
  if (attempt < 8) return 1500;
  if (attempt < 20) return 2500;
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
  const aloneRef = useRef(true);

  const goToPact = useCallback((activeId: string) => {
    if (leftRef.current) return;
    leftRef.current = true;
    setStatus('Présence trouvée. Ouverture…');
    setAlone(false);
    aloneRef.current = false;
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
    aloneRef.current = alone;
  }, [alone]);

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
          'Toujours seul(e) : c’est normal. Tu peux respirer en attendant, ou revenir plus tard.'
        );
      }
      if (seconds === 150) {
        setHonest(
          'Laisse cette page ouverte si tu veux rester dans la file, ou reviens avec le même email et la même durée.'
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
    let cancelled = false;

    const beat = () => {
      if (cancelled || leftRef.current) return;
      if (typeof navigator !== 'undefined' && !navigator.onLine) return;
      fetch('/api/heartbeat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pactId }),
      }).catch(() => {});
    };

    beat();
    const t = setInterval(beat, 25_000);
    return () => {
      cancelled = true;
      clearInterval(t);
    };
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
        nextPollMs(attemptRef.current, liveRef.current, aloneRef.current)
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

        const isAlone = data.alone !== false;
        setAlone(isAlone);
        aloneRef.current = isAlone;

        if (!liveRef.current) {
          setStatus(
            data.message ||
              (isAlone
                ? 'Tu es seul(e) dans la file pour l’instant.'
                : 'Toujours en attente…')
          );
        }
        writeSession({ status: 'WAITING' });
        if (data.debug) {
          setHint(
            `Durée : ${data.debug.myDuration} j · File : ${data.debug.totalWaiting} · Actifs : ${data.debug.livePartners ?? 0}`
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
      <section className="flex-1 py-10 md:py-14 pact-shell">
        <div className="max-w-md mx-auto px-4 text-center w-full">
          <div className="mx-auto mb-6 flex justify-center">
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
            . Match uniquement si une autre personne est active avec la même
            durée.
          </p>

          <div className="mt-4 flex flex-wrap justify-center gap-2 text-[11px]">
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

          <div className="card-premium mt-7 p-6 sm:p-7">
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
            className="mt-5 text-xs leading-relaxed max-w-[36ch] mx-auto"
            style={{ color: 'var(--muted)' }}
          >
            {honest}
          </p>

          {/* Attente utile : pas un cul-de-sac */}
          {alone && pactId && (
            <div className="mt-8 text-left space-y-3">
              <p className="section-label text-center">En attendant</p>
              <p
                className="text-xs text-center leading-relaxed"
                style={{ color: 'var(--muted)' }}
              >
                La file continue en arrière-plan si tu gardes cet onglet ouvert.
              </p>
              <Link
                href="/outils?outil=coherence"
                className="access-card block"
              >
                <span className="font-semibold text-sm">Cohérence cardiaque</span>
                <span
                  className="block text-xs mt-1"
                  style={{ color: 'var(--muted)' }}
                >
                  5 minutes · respiration guidée
                </span>
              </Link>
              <Link href="/outils?outil=ground" className="access-card block">
                <span className="font-semibold text-sm">Ancrage 5-4-3-2-1</span>
                <span
                  className="block text-xs mt-1"
                  style={{ color: 'var(--muted)' }}
                >
                  Revenir dans le corps
                </span>
              </Link>
              <Link href="/outils?outil=breath" className="access-card block">
                <span className="font-semibold text-sm">Autres respirations</span>
                <span
                  className="block text-xs mt-1"
                  style={{ color: 'var(--muted)' }}
                >
                  4/6 · carré · 4-7-8
                </span>
              </Link>
            </div>
          )}

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
              Tester à deux (2 min)
            </p>
            <p>1. Deux téléphones ou deux emails différents</p>
            <p>2. Même durée (ex. 3 jours)</p>
            <p>3. Les deux restent sur cette page d’attente</p>
            <p>4. Le match ouvre le pacte automatiquement</p>
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
            <Link
              href="/"
              className="text-sm min-h-[44px] grid place-items-center"
              style={{ color: 'var(--muted)' }}
            >
              Accueil
            </Link>
          </div>

          <p
            className="mt-8 text-[11px] leading-relaxed"
            style={{ color: 'var(--muted)' }}
          >
            En détresse : 3114 · 15 · 112
          </p>
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
