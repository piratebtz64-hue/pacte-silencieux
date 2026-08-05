'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function WaitingPage() {
  const [email, setEmail] = useState<string | null>(null);
  const [duration, setDuration] = useState<string | null>(null);
  const [waitingTime, setWaitingTime] = useState<string>('--:--');

  useEffect(() => {
    const storedEmail = localStorage.getItem('pacte_email');
    const storedDuration = localStorage.getItem('pacte_duration');

    if (storedEmail) setEmail(storedEmail);
    if (storedDuration) setDuration(storedDuration);

    // Simple timer for demonstration
    let seconds = 0;
    const interval = setInterval(() => {
      seconds++;
      const minutes = Math.floor(seconds / 60);
      const secs = seconds % 60;
      setWaitingTime(
        `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <main className="min-h-screen flex flex-col">
      <Header />

      <section className="flex-1 grid place-items-center py-16">
        <div className="max-w-md mx-auto px-4 text-center">
          <div className="text-6xl mb-6 animate-pulse">🕯️</div>

          <h1 className="text-3xl font-serif">En attente d'appairage</h1>

          <p className="mt-4 text-[#706b63] dark:text-[#a49f96]">
            Quelqu'un d'autre rejoint actuellement un pacte de {duration} jour
            {Number(duration) > 1 ? 's' : ''}. Si la durée correspond, vous serez
            appairés.
          </p>

          <div className="mt-8 p-6 rounded-xl bg-[#f2eee5] dark:bg-white/5 border border-black/10 dark:border-white/10">
            <div className="text-sm text-[#a49f96] mb-2">Temps écoulé</div>
            <div className="text-4xl font-serif text-[#1f6b67]">{waitingTime}</div>
          </div>

          <div className="mt-8 p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
            <p className="text-sm text-blue-900 dark:text-blue-300">
              Gardez cette onglet ouvert. L'appairage se fera automatiquement.
            </p>
          </div>

          <p className="mt-6 text-xs text-[#a49f96]">
            Email: <strong>{email}</strong>
          </p>

          <Link
            href="/"
            className="mt-8 inline-block text-sm text-[#706b63] dark:text-[#a49f96] hover:underline"
          >
            ← Retour à l'accueil
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}
