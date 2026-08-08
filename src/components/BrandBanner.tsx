import { ShushIcon } from './Logo';

/** Bannière : teal profond = confiance + calme (pas de noir agressif) */
export default function BrandBanner() {
  return (
    <div
      className="relative w-full overflow-hidden border-b"
      style={{ borderColor: 'rgba(47, 111, 102, 0.25)' }}
    >
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(108deg, #1a322e 0%, #234840 42%, #1c3833 100%)',
        }}
      />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 85% 130% at 50% -35%, rgba(92,179,166,0.28), transparent 58%)',
        }}
      />

      <div className="relative max-w-6xl mx-auto px-4 py-5 sm:py-6 flex items-center justify-center gap-3.5 animate-fade-in">
        <div
          className="shrink-0 flex h-12 w-12 items-center justify-center rounded-full"
          style={{
            color: '#e8f5f2',
            background: 'rgba(232, 245, 242, 0.08)',
            boxShadow: 'inset 0 0 0 1px rgba(232, 245, 242, 0.28)',
          }}
        >
          <ShushIcon className="h-6 w-6" />
        </div>
        <div className="text-left min-w-0">
          <p
            className="font-serif text-lg sm:text-xl tracking-wide"
            style={{ color: '#e8f5f2' }}
          >
            Le Pacte silencieux
          </p>
          <p
            className="mt-0.5 text-[11px] sm:text-xs tracking-[0.06em]"
            style={{ color: 'rgba(232, 245, 242, 0.55)' }}
          >
            Une présence, quand l’entourage n’est pas là
          </p>
        </div>
      </div>
    </div>
  );
}
