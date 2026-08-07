import { ShushIcon } from './Logo';

/** Bannière de marque inspirée de l’image officielle */
export default function BrandBanner() {
  return (
    <div
      className="relative overflow-hidden rounded-2xl"
      style={{
        background:
          'radial-gradient(ellipse 90% 70% at 50% -5%, #4a5548 0%, #2a322c 35%, #141816 70%, #0a0c0b 100%)',
        minHeight: '280px',
      }}
    >
      {/* Gros faisceau central */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'linear-gradient(180deg, rgba(255,236,200,0.22) 0%, rgba(255,236,200,0.08) 28%, transparent 58%)',
        }}
      />
      {/* Rayons latéraux */}
      <div
        className="pointer-events-none absolute left-1/2 top-0 h-[85%] w-[70%] -translate-x-1/2 opacity-60"
        style={{
          background:
            'conic-gradient(from 195deg at 50% 0%, transparent 0deg, rgba(255,240,210,0.18) 12deg, transparent 28deg, transparent 152deg, rgba(255,240,210,0.14) 168deg, transparent 185deg)',
        }}
      />
      {/* Ligne de lumière verticale douce */}
      <div
        className="pointer-events-none absolute left-1/2 top-0 h-full w-px -translate-x-1/2 opacity-30"
        style={{
          background:
            'linear-gradient(to bottom, rgba(255,245,220,0.7), transparent 65%)',
        }}
      />

      <div className="relative flex flex-col items-center justify-center px-6 py-16 text-center text-[#f7f2ea]">
        <h2
          className="font-serif text-3xl md:text-4xl tracking-wide"
          style={{ textShadow: '0 2px 24px rgba(0,0,0,0.35)' }}
        >
          Le Pacte Silencieux
        </h2>

        {/* Logo chut */}
        <div className="mt-7 mb-7 flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full border border-[#f7f2ea]/45 text-[#f7f2ea] bg-black/20 backdrop-blur-sm">
            <ShushIcon className="h-9 w-9" />
          </div>
        </div>

        <p className="text-sm md:text-[15px] text-[#f7f2ea]/80 tracking-wide max-w-[22ch]">
          Un espace d’entraide sociale discrète
        </p>
      </div>

      {/* Brume bas */}
      <div
        className="pointer-events-none absolute bottom-0 left-0 right-0 h-20"
        style={{
          background:
            'linear-gradient(to top, rgba(247,242,234,0.12), transparent)',
        }}
      />
    </div>
  );
}
