import Link from 'next/link';

export function ShushIcon({ className = 'h-5 w-5' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M16 22c3 4 6 5.5 8 5.5s5-1.5 8-5.5" />
      <path d="M16 22c3-2.5 6-3.5 8-3.5s5 1 8 3.5" />
      <path d="M24 12v20" strokeWidth="2.2" />
      <circle cx="24" cy="11" r="2.1" fill="currentColor" stroke="none" />
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
      className={`inline-flex items-center gap-3 group ${className}`}
      aria-label="Le Pacte silencieux — accueil"
    >
      <span
        className="logo-ring relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
        style={{
          background:
            'linear-gradient(145deg, rgba(26,92,88,0.14), rgba(26,92,88,0.03))',
          boxShadow:
            'inset 0 0 0 1.5px var(--accent), 0 4px 14px var(--glow)',
          color: 'var(--accent)',
        }}
      >
        <ShushIcon className="h-[1.15rem] w-[1.15rem]" />
      </span>
      {showText && (
        <span className="flex flex-col leading-none">
          <span className="font-serif text-[0.95rem] font-semibold tracking-tight">
            Le Pacte silencieux
          </span>
          <span
            className="mt-0.5 text-[10px] uppercase tracking-[0.16em] hidden sm:block"
            style={{ color: 'var(--muted)' }}
          >
            présence discrète
          </span>
        </span>
      )}
    </Link>
  );
}
