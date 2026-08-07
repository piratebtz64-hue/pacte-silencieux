'use client';

import Link from 'next/link';
import ThemeToggle from './ThemeToggle';
import Logo from './Logo';

export default function Header({ showCta = true }: { showCta?: boolean }) {
  return (
    <header className="sticky top-0 z-50 backdrop-blur bg-[color-mix(in_srgb,var(--background)_72%,transparent)] border-b border-black/10 dark:border-white/10">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Logo />
        <div className="flex items-center gap-3">
          {showCta && (
            <Link
              href="/start"
              className="px-4 py-2 rounded-full bg-[#1f6b67] text-white text-sm font-bold hover:bg-[#184f4d] transition"
            >
              Entrer dans un pacte
            </Link>
          )}
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
