'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Logo from './Logo';
import ThemeToggle from './ThemeToggle';
import { hasSessionHint, resolveAndSyncSession, readSession } from '@/lib/session';

export default function Header({ showCta = true }: { showCta?: boolean }) {
  const [hasSession, setHasSession] = useState(false);

  useEffect(() => {
    setHasSession(hasSessionHint());
  }, []);

  const openMyPact = async () => {
    const s = readSession();
    const result = await resolveAndSyncSession(s.email || undefined);
    window.location.assign(result.continueUrl || '/start');
  };

  return (
    <header
      className="sticky top-0 z-40 border-b backdrop-blur-md"
      style={{
        borderColor: 'var(--border)',
        background: 'color-mix(in srgb, var(--background) 86%, transparent)',
      }}
    >
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between gap-3">
        <Link href="/" className="shrink-0" aria-label="Accueil">
          <Logo />
        </Link>

        <nav className="hidden sm:flex items-center gap-1 text-xs font-medium">
          <Link
            href="/outils"
            className="px-3 py-2 rounded-lg hover:opacity-80"
            style={{ color: 'var(--muted)' }}
          >
            Outils
          </Link>
          <Link
            href="/selection"
            className="px-3 py-2 rounded-lg hover:opacity-80"
            style={{ color: 'var(--muted)' }}
          >
            Sélection
          </Link>
          <Link
            href="/#aide"
            className="px-3 py-2 rounded-lg hover:opacity-80"
            style={{ color: 'var(--muted)' }}
          >
            Aide
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          {hasSession && (
            <button
              type="button"
              onClick={openMyPact}
              className="btn-ghost !py-2 !px-3 !text-xs"
            >
              Mon pacte
            </button>
          )}
          {showCta && (
            <Link href="/start" className="btn-primary !py-2 !px-4 !text-sm">
              {hasSession ? 'Reprendre' : 'Commencer'}
            </Link>
          )}
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
