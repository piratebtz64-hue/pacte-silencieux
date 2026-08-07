/** Bannière de marque — lumière, silence, logo chut */
export default function BrandBanner() {
  return (
    <div
      className="relative overflow-hidden rounded-2xl border border-black/10 dark:border-white/10"
      style={{
        background:
          'radial-gradient(ellipse 80% 60% at 50% 0%, #3d4a3f 0%, #1a1f1c 45%, #0d0f0e 100%)',
      }}
    >
      {/* Rayons de lumière */}
      <div
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{
          background:
            'conic-gradient(from 200deg at 50% -10%, transparent 0deg, rgba(245,230,200,0.15) 20deg, transparent 40deg, transparent 140deg, rgba(245,230,200,0.12) 160deg, transparent 180deg)',
        }}
      />
      <div
        className="pointer-events-none absolute left-1/2 top-0 h-full w-[2px] -translate-x-1/2 opacity-40"
        style={{
          background:
            'linear-gradient(to bottom, rgba(255,240,210,0.5), transparent 70%)',
        }}
      />

      <div className="relative px-6 py-14 md:py-16 text-center text-[#f5f0e8]">
        <h2 className="font-serif text-3xl md:text-4xl tracking-wide">
          Le Pacte Silencieux
        </h2>

        {/* Logo chut */}
        <div className="mt-6 mb-6 flex justify-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full border border-[#f5f0e8]/50 text-[#f5f0e8]">
            <svg
              viewBox="0 0 64 64"
              className="h-8 w-8"
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
          </div>
        </div>

        <p className="text-sm md:text-base text-[#f5f0e8]/85 tracking-wide">
          Un espace d’entraide sociale discrète
        </p>
      </div>

      {/* Brume bas */}
      <div
        className="pointer-events-none absolute bottom-0 left-0 right-0 h-16 opacity-50"
        style={{
          background:
            'linear-gradient(to top, rgba(245,240,232,0.12), transparent)',
        }}
      />
    </div>
  );
}
