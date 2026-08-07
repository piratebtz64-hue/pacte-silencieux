import Link from 'next/link';

/** Logo officiel : doigt sur la bouche (chut) dans un cercle */
export function ShushIcon({ className = 'h-5 w-5' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      {/* Tête / visage stylisé */}
      <circle cx="32" cy="28" r="14" stroke="currentColor" strokeWidth="2.2" />
      {/* Bouche fermée */}
      <path
        d="M26 32c2 2.5 4.5 3.5 6 3.5s4-1 6-3.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      {/* Doigt vertical sur la bouche */}
      <rect
        x="29.5"
        y="22"
        width="5"
        height="22"
        rx="2.5"
        fill="currentColor"
      />
      {/* Bout du doigt */}
      <ellipse cx="32" cy="22" rx="2.8" ry="3.2" fill="currentColor" />
    </svg>
  );
}

export default function Logo({
  className = '',
  showText = true,
  href = '/',
}: {
  className?: string;
  showText?: boolean;
  href?: string;
}) {
  return (
    <Link
      href={href}
      className={`inline-flex items-center gap-2.5 group ${className}`}
      aria-label="Le Pacte silencieux — accueil"
    >
      <span className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-[#1f6b67] text-[#1f6b67] group-hover:bg-[#1f6b67]/10 transition">
        <ShushIcon className="h-5 w-5" />
      </span>
      {showText && (
        <span className="font-bold text-sm tracking-wide leading-tight">
          Le Pacte
          <span className="hidden sm:inline"> silencieux</span>
        </span>
      )}
    </Link>
  );
}
