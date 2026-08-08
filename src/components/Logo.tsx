'use client';

import Link from 'next/link';

/** Icône « chut » réutilisable (bannière, logo, etc.) */
export function ShushIcon({ className = 'h-5 w-5' }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.4" opacity="0.35" />
      <path
        d="M12 7.2c-1.6 0-2.9 1.15-2.9 2.55 0 1.1.7 2.05 1.7 2.45v1.5h2.4v-1.5c1-.4 1.7-1.35 1.7-2.45C14.9 8.35 13.6 7.2 12 7.2z"
        fill="currentColor"
        opacity="0.9"
      />
      <path
        d="M9.2 15.6h5.6M10 17.2h4"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        opacity="0.75"
      />
      <path
        d="M12 11.2v5.2"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** Logo → toujours la page d’accueil */
export default function Logo() {
  return (
    <Link
      href="/"
      className="group flex items-center gap-2.5 no-underline"
      aria-label="Le Pacte silencieux — accueil"
    >
      <span
        className="logo-ring flex h-9 w-9 items-center justify-center rounded-full border"
        style={{
          borderColor: 'color-mix(in srgb, var(--accent) 35%, transparent)',
          background: 'var(--accent-soft)',
          color: 'var(--accent)',
        }}
      >
        <ShushIcon className="h-5 w-5" />
      </span>
      <span className="font-serif text-[0.95rem] sm:text-base tracking-tight font-semibold">
        Le Pacte silencieux
      </span>
    </Link>
  );
}
