import Link from 'next/link';

/** Logo officiel : doigt sur les lèvres (chut) */
export function ShushIcon({ className = 'h-5 w-5' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M16 22c3 4 6 5.5 8 5.5s5-1.5 8-5.5" />
      <path d="M16 22c3-2.5 6-3.5 8-3.5s5 1 8 3.5" />
      <path d="M24 12v20" strokeWidth="2.4" />
      <circle cx="24" cy="11" r="2.3" fill="currentColor" stroke="none" />
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
