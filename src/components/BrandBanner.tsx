/** Bandeau de marque — pleine largeur, format slim */
export default function BrandBanner() {
  return (
    <div
      className="relative w-full overflow-hidden"
      style={{
        background:
          'radial-gradient(ellipse 80% 120% at 50% -20%, #3d4538 0%, #1a1f1a 50%, #0c0e0c 100%)',
      }}
    >
      {/* Lumière haute */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'linear-gradient(180deg, rgba(255,236,200,0.18) 0%, rgba(255,236,200,0.05) 45%, transparent 100%)',
        }}
      />
      <div
        className="pointer-events-none absolute left-1/2 top-0 h-full w-[60%] -translate-x-1/2 opacity-50"
        style={{
          background:
            'conic-gradient(from 200deg at 50% 0%, transparent 0deg, rgba(255,240,210,0.2) 15deg, transparent 35deg, transparent 145deg, rgba(255,240,210,0.15) 165deg, transparent 185deg)',
        }}
      />

      {/* Contenu horizontal compact */}
      <div className="relative max-w-6xl mx-auto px-4 py-5 sm:py-6 flex items-center justify-center gap-3 sm:gap-4">
        {/* Logo chut — doigt sur lèvres */}
        <div className="shrink-0 flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-full border border-[#f5f0e8]/40 text-[#f5f0e8]">
          <svg
            viewBox="0 0 48 48"
            className="h-7 w-7"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            {/* Lèvres */}
            <path d="M16 22c3 4 6 5.5 8 5.5s5-1.5 8-5.5" />
            <path d="M16 22c3-2.5 6-3.5 8-3.5s5 1 8 3.5" />
            {/* Doigt */}
            <path d="M24 12v20" strokeWidth="2.2" />
            <circle cx="24" cy="11" r="2.2" fill="currentColor" stroke="none" />
          </svg>
        </div>

        <div className="text-left min-w-0">
          <p className="font-serif text-lg sm:text-xl md:text-2xl text-[#f5f0e8] tracking-wide leading-tight">
            Le Pacte Silencieux
          </p>
          <p className="mt-0.5 text-[11px] sm:text-xs text-[#f5f0e8]/70 tracking-wide">
            Un espace d’entraide sociale discrète
          </p>
        </div>
      </div>

      {/* Brume bas très légère */}
      <div
        className="pointer-events-none absolute bottom-0 left-0 right-0 h-6 opacity-40"
        style={{
          background:
            'linear-gradient(to top, rgba(245,240,232,0.1), transparent)',
        }}
      />
    </div>
  );
}
