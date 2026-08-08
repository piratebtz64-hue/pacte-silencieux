'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('App error:', error);
  }, [error]);

  return (
    <main className="min-h-screen grid place-items-center px-4">
      <div className="max-w-md text-center">
        <p
          className="text-xs font-bold uppercase tracking-[0.14em]"
          style={{ color: 'var(--accent)' }}
        >
          Erreur
        </p>
        <h1 className="mt-3 font-serif text-2xl tracking-tight">
          Un problème est survenu
        </h1>
        <p className="mt-3 text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>
          Ce n’est pas de ta faute. Tu peux réessayer, ou revenir à l’accueil.
        </p>
        {error.digest && (
          <p className="mt-2 text-[11px]" style={{ color: 'var(--muted)' }}>
            Réf. {error.digest}
          </p>
        )}
        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <button type="button" onClick={reset} className="btn-primary">
            Réessayer
          </button>
          <Link href="/" className="btn-ghost text-center">
            Accueil
          </Link>
          <Link href="/start" className="btn-ghost text-center">
            Commencer
          </Link>
        </div>
      </div>
    </main>
  );
}
