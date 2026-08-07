import { ShushIcon } from './Logo';

/** Bandeau de marque — slim, plein largeur, premium */
export default function BrandBanner() {
  return (
    <div className="relative w-full overflow-hidden border-b border-white/5">
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(105deg, #0c100e 0%, #1a221c 40%, #121816 70%, #0a0c0b 100%)',
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          background:
            'radial-gradient(ellipse 70% 100% at 50% -40%, rgba(255,230,190,0.22), transparent 55%)',
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          background:
            'radial-gradient(ellipse 40% 80% at 80% 50%, rgba(61,154,148,0.15), transparent)',
        }}
      />

      <div className="relative max-w-6xl mx-auto px-4 py-4 sm:py-5 flex items-center justify-center gap-3.5">
        <div
          className="shrink-0 flex h-11 w-11 items-center justify-center rounded-full text-[#f3efe6]"
          style={{
            boxShadow:
              'inset 0 0 0 1px rgba(243,239,230,0.35), 0 0 24px rgba(255,230,190,0.12)',
          }}
        >
          <ShushIcon className="h-6 w-6" />
        </div>
        <div className="text-left min-w-0">
          <p className="font-serif text-lg sm:text-xl text-[#f3efe6] tracking-wide">
            Le Pacte silencieux
          </p>
          <p className="mt-0.5 text-[11px] sm:text-xs text-[#f3efe6]/65 tracking-[0.06em]">
            Un espace d’entraide sociale discrète
          </p>
        </div>
      </div>
    </div>
  );
}
