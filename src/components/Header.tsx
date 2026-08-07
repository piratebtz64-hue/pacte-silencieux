'use client';

import Link from 'next/link';
import ThemeToggle from './ThemeToggle';
import Logo from './Logo';
import ShareButton from './ShareButton';

export default function Header({ showCta = true }: { showCta?: boolean }) {
  return (
    <header
      className="sticky top-0 z-50 border-b"
      style={{
        borderColor: 'var(--border)',
        background:
          'color-mix(in srgb, var(--background) 78%, transparent)',
        backdropFilter: 'blur(16px) saturate(1.2)',
        WebkitBackdropFilter: 'blur(16px) saturate(1.2)',
      }}
    >
      <div className="max-w-6xl mx-auto px-4 py-3.5 flex items-center justify-between gap-2">
        <Logo />
        <div className="flex items-center gap-2 sm:gap-3">
          <ShareButton label="Partager" className="hidden sm:inline-block" />
          {showCta && (
            <Link href="/start" className="btn-primary !py-2 !px-4 !text-sm">
              Commencer
            </Link>
          )}
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
