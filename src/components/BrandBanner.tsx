import { ShushIcon } from './Logo';

export default function BrandBanner() {
  return (
    <div
      className="relative w-full overflow-hidden border-b"
      style={{ borderColor: 'var(--border)' }}
    >
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(105deg, #1a2420 0%, #24352e 45%, #1c2824 100%)',
        }}
      />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 80% 140% at 50% -40%, rgba(107,168,148,0.22), transparent 55%)',
        }}
      />

      <div className="relative max-w-6xl mx-auto px-4 py-5 sm:py-6 flex items-center justify-center gap-3.5 animate-fade-in">
        <div
          className="shrink-0 flex h-12 w-12 items-center justify-center rounded-full"
          style={{
            color: '#f3efe6',
            background: 'rgba(252,250,245,0.06)',
            boxShadow: 'inset 0 0 0 1px rgba(243,239,230,0.28)',
          }}
        >
          <ShushIcon className="h-6 w-6" />
        </div>
        <div className="text-left min-w-0">
          <p className="font-serif text-lg sm:text-xl tracking-wide" style={{ color: '#f3efe6' }}>
            Le Pacte silencieux
          </p>
          <p
            className="mt-0.5 text-[11px] sm:text-xs tracking-[0.06em]"
            style={{ color: 'rgba(243,239,230,0.55)' }}
          >
            Une présence, quand l’entourage n’est pas là
          </p>
        </div>
      </div>
    </div>
  );
}
