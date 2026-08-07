'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

function WaitingContent() {
  const router = useRouter();
  const [email, setEmail] = useState<string | null>(null);
  const [duration, setDuration] = useState<string | null>(null);
  const [waitingTime, setWaitingTime] = useState('00:00');
  const [status, setStatus] = useState('Recherche d’une présence…');
  const [pactId, setPactId] = useState<string | null>(null);
  const [hint, setHint] = useState<string | null>(null);

  useEffect(() => {
    setEmail(localStorage.getItem('pacte_email'));
    setDuration(localStorage.getItem('pacte_duration'));
    setPactId(localStorage.getItem('pacte_pactId'));

    let seconds = 0;
    const timer = setInterval(() => {
      seconds++;
      const m = Math.floor(seconds / 60);
      const s = seconds % 60;
      setWaitingTime(
        `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
      );
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
          localStorage.setItem('pacte_pactId', data.pactId);
          router.push(`/pact/${data.pactId}`);
          return;
        }

        setStatus(data.message || 'Toujours en attente…');
        if (data.debug) {
          setHint(
            `Ta durée : ${data.debug.myDuration} j · En attente total : ${data.debug.totalWaiting}`
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
  }, [pactId, router]);

  return (
    <main className="min-h-screen flex flex-col">
      <Header />
      <section className="flex-1 grid place-items-center py-16">
        <div className="max-w-md mx-auto px-4 text-center">
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-[#1f6b67]/15 grid place-items-center">
            <div className="w-8 h-8 rounded-full bg-[#1f6b67]/40 animate-pulse" />
          </div>

          <h1 className="text-3xl font-serif">En attente</h1>
          <p className="mt-4 text-[#706b63] dark:text-[#a49f96] leading-relaxed">
            Pacte
            {duration
              ? ` de ${duration} jour${Number(duration) > 1 ? 's' : ''}`
              : ''}
            . Recherche toutes les 3 secondes.
          </p>

          <div className="mt-8 p-6 rounded-2xl bg-[#f2eee5] dark:bg-white/5 border border-black/10 dark:border-white/10">
            <div className="text-sm text-[#a49f96] mb-2">Temps d’attente</div>
            <div className="text-4xl font-serif text-[#1f6b67]">{waitingTime}</div>
            <p className="mt-3 text-sm text-[#706b63] dark:text-[#a49f96]">
              {status}
            </p>
            {hint && (
              <p className="mt-2 text-xs text-[#a49f96]">{hint}</p>
            )}
          </div>

          {!pactId && (
            <div className="mt-6 p-4 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 text-sm text-amber-900 dark:text-amber-200">
              Aucune session trouvée sur cet appareil.{' '}
              <Link href="/start" className="underline font-bold">
                Recommencer un pacte
              </Link>
            </div>
          )}

          <div className="mt-6 text-xs text-[#a49f96] leading-relaxed space-y-1">
            <p>
              ✓ Deux <strong>emails différents</strong>
            </p>
            <p>
              ✓ La <strong>même durée</strong> sur les deux téléphones
            </p>
            <p>✓ Les deux pages d’attente ouvertes</p>
          </div>

          {email && (
            <p className="mt-4 text-xs text-[#a49f96]">
              Cet appareil : <strong>{email}</strong>
              {duration ? ` · ${duration} j` : ''}
            </p>
          )}

          <Link
            href="/start"
            className="mt-8 inline-block text-sm text-[#1f6b67] font-bold hover:underline"
          >
            Relancer un nouveau pacte
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
          <p className="text-[#706b63]">Chargement…</p>
        </main>
      }
    >
      <WaitingContent />
    </Suspense>
  );
}
