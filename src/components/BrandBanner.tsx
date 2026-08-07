import { ShushIcon } from './Logo';

export default function BrandBanner() {
  return (
    <div className="relative w-full overflow-hidden border-b border-white/5">
      <div
        className="absolute inset-0 transition-opacity duration-700"
        style={{
          background:
            'linear-gradient(115deg, #0a0e0c 0%, #152018 38%, #0f1411 72%, #080a09 100%)',
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{
          background:
            'radial-gradient(ellipse 75% 120% at 50% -50%, rgba(255,228,185,0.28), transparent 55%)',
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          background:
            'radial-gradient(ellipse 35% 90% at 85% 40%, rgba(74,173,165,0.2), transparent)',
        }}
      />

      <div className="relative max-w-6xl mx-auto px-4 py-4 sm:py-5 flex items-center justify-center gap-3.5 animate-fade-in">
        <div
          className="animate-float shrink-0 flex h-11 w-11 items-center justify-center rounded-full text-[#f3efe6]"
          style={{
            boxShadow:
              'inset 0 0 0 1px rgba(243,239,230,0.4), 0 0 28px rgba(255,228,185,0.15)',
          }}
        >
          <ShushIcon className="h-6 w-6" />
        </div>
        <div className="text-left min-w-0">
          <p className="font-serif text-lg sm:text-xl text-[#f3efe6] tracking-wide">
            Le Pacte silencieux
          </p>
          <p className="mt-0.5 text-[11px] sm:text-xs text-[#f3efe6]/6 tracking-[0.08em]">
            Un espace d’entraide sociale discrète
          </p>
        </div>
      </div>
    </div>
  );
}
