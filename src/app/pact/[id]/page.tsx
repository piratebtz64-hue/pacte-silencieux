'use client';

import { useEffect, useState, use } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface Pact {
  id: string;
  status: string;
  durationDays: number;
  startedAt: string | null;
  endsAt: string | null;
  userA: { id: string; email: string } | null;
  userB: { id: string; email: string } | null;
}

export default function PactPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [pact, setPact] = useState<Pact | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPact = async () => {
      try {
        const res = await fetch(`/api/pact?pactId=${id}`);
        if (!res.ok) throw new Error('Pacte non trouvé');
        const data = await res.json();
        setPact(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur de chargement');
      } finally {
        setLoading(false);
      }
    };

    fetchPact();
  }, [id]);

  if (loading) {
    return (
      <main className="min-h-screen grid place-items-center">
        <div className="text-center">
          <div className="text-4xl mb-4 animate-spin">⏳</div>
          <p className="text-[#706b63] dark:text-[#a49f96]">Chargement…</p>
        </div>
      </main>
    );
  }

  if (error || !pact) {
    return (
      <main className="min-h-screen grid place-items-center">
        <div className="max-w-md mx-auto px-4 text-center">
          <div className="text-4xl mb-4">⚠️</div>
          <h1 className="text-2xl font-serif">Erreur</h1>
          <p className="mt-2 text-[#706b63] dark:text-[#a49f96]">{error}</p>
          <Link
            href="/"
            className="mt-6 inline-block px-6 py-3 rounded-full bg-[#1f6b67] text-white font-bold hover:bg-[#184f4d] transition"
          >
            Retour à l'accueil
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col">
      <Header />

      <section className="flex-1 py-16">
        <div className="max-w-2xl mx-auto px-4">
          <Link
            href="/"
            className="text-sm text-[#706b63] dark:text-[#a49f96] hover:underline"
          >
            ← Retour
          </Link>

          <div className="mt-8 p-8 rounded-2xl border border-black/10 dark:border-white/10 bg-white/60 dark:bg-white/5">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-3xl font-serif">Votre pacte</h1>
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold ${
                  pact.status === 'ACTIVE'
                    ? 'bg-green-100 dark:bg-green-900/30 text-green-900 dark:text-green-300'
                    : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-900 dark:text-yellow-300'
                }`}
              >
                {pact.status === 'ACTIVE' ? 'Actif' : 'En attente'}
              </span>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-sm text-[#a49f96] mb-1">Durée</p>
                <p className="text-lg font-bold">
                  {pact.durationDays} jour{pact.durationDays > 1 ? 's' : ''}
                </p>
              </div>

              {pact.startedAt && (
                <div>
                  <p className="text-sm text-[#a49f96] mb-1">Commencé le</p>
                  <p className="text-lg font-bold">
                    {new Date(pact.startedAt).toLocaleDateString('fr-FR')}
                  </p>
                </div>
              )}

              {pact.status === 'WAITING' && (
                <div className="mt-6 p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                  <p className="text-sm text-blue-900 dark:text-blue-300">
                    ⏳ Vous êtes en attente d'appairage avec une autre personne
                    ayant la même durée.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
