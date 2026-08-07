import Link from 'next/link';

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
        {/* Icône chut — doigt sur la bouche */}
        <svg
          viewBox="0 0 64 64"
          className="h-5 w-5"
          fill="currentColor"
          aria-hidden
        >
          <path d="M28 16c0-2.2 1.8-4 4-4s4 1.8 4 4v15.2c1.9 1.1 3.2 3.1 3.2 5.5 0 3.5-2.8 6.3-6.3 6.3s-6.3-2.8-6.3-6.3c0-2.4 1.3-4.4 3.2-5.5V16z" />
          <path
            d="M24 40c1.2 3.5 4.2 6 7.9 6s6.7-2.5 7.9-6"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            opacity="0.55"
          />
        </svg>
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
