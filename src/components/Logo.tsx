'use client';

import Link from 'next/link';

/** Logo → toujours la page d’accueil */
export default function Logo() {
  return (
    <Link
      href="/"
      className="group flex items-center gap-2.5 no-underline"
      aria-label="Le Pacte silencieux — accueil"
    >
      <span
        className="logo-ring flex h-9 w-9 items-center justify-center rounded-full border text-sm"
        style={{
          borderColor: 'color-mix(in srgb, var(--accent) 35%, transparent)',
          background: 'var(--accent-soft)',
          color: 'var(--accent)',
        }}
      >
        🤫
      </span>
      <span className="font-serif text-[0.95rem] sm:text-base tracking-tight font-semibold">
        Le Pacte silencieux
      </span>
    </Link>
  );
}
