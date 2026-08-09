'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Logo from './Logo';
import ThemeToggle from './ThemeToggle';
import { hasSessionHint, resolveAndSyncSession, readSession } from '@/lib/session';

export default function Header({ showCta = true }: { showCta?: boolean }) {
  const [hasSession, setHasSession] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    setHasSession(hasSessionHint());
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const openMyPact = async () => {
    const s = readSession();
    const result = await resolveAndSyncSession(s.email || undefined);
    window.location.assign(result.continueUrl || '/start');
  };

  return (
    <header
      className="sticky top-0 z-40 border-b transition-[background,box-shadow] duration-300"
      style={{
        borderColor: scrolled ? 'var(--border)' : 'transparent',
        background: scrolled
          ? 'color-mix(in srgb, var(--background) 88%, transparent)'
          : 'color-mix(in srgb, var(--background) 72%, transparent)',
        backdropFilter: 'blur(16px)',
        boxShadow: scrolled ? 'var(--shadow-soft)' : 'none',
      }}
    >
      <div className="max-w-5xl mx-auto px-3 sm:px-4 h-14 sm:h-16 flex items-center justify-between gap-2 min-w-0">
        <div className="min-w-0 shrink">
          <Logo />
        </div>

        <nav className="hidden md:flex items-center gap-0.5 text-[13px] font-medium shrink-0">
          {[
            ['/outils', 'Outils'],
            ['/selection', 'Sélection'],
            ['/#aide', 'Aide'],
          ].map(([href, label]) => (
            <Link
              key={href}
              href={href}
              className="px-3.5 py-2 rounded-full hover:opacity-100 opacity-75 transition-opacity"
              style={{ color: 'var(--muted)' }}
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Un seul CTA à droite : évite Mon pacte + Reprendre qui se coupent */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {showCta && hasSession && (
            <button
              type="button"
              onClick={openMyPact}
              className="btn-primary !py-2 !px-3 sm:!px-4 !text-xs sm:!text-sm whitespace-nowrap"
            >
              Reprendre
            </button>
          )}
          {showCta && !hasSession && (
            <Link
              href="/start"
              className="btn-primary !py-2 !px-3 sm:!px-4 !text-xs sm:!text-sm whitespace-nowrap"
            >
              Commencer
            </Link>
          )}
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
