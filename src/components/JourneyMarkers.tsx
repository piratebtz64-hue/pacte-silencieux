/** Jalons du parcours : où en est la personne. */

const STEPS = [
  { id: 'start', label: 'Inscription' },
  { id: 'waiting', label: 'Attente' },
  { id: 'pact', label: 'Pacte' },
] as const;

export type JourneyStep = (typeof STEPS)[number]['id'];

export default function JourneyMarkers({
  current,
}: {
  current: JourneyStep;
}) {
  const idx = STEPS.findIndex((s) => s.id === current);

  return (
    <nav
      aria-label="Étapes du parcours"
      className="flex items-center justify-center gap-1 sm:gap-2 text-[11px] sm:text-xs"
    >
      {STEPS.map((s, i) => {
        const done = i < idx;
        const active = i === idx;
        return (
          <div key={s.id} className="flex items-center gap-1 sm:gap-2">
            {i > 0 && (
              <span
                className="w-4 sm:w-6 h-px"
                style={{
                  background: done || active ? 'var(--accent)' : 'var(--border)',
                }}
                aria-hidden
              />
            )}
            <span
              className="flex items-center gap-1.5"
              style={{
                color: active
                  ? 'var(--accent)'
                  : done
                    ? 'var(--muted)'
                    : 'var(--muted)',
                fontWeight: active ? 700 : 500,
                opacity: done || active ? 1 : 0.55,
              }}
            >
              <span
                className="inline-flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold"
                style={{
                  background: active || done ? 'var(--accent-soft)' : 'var(--mist)',
                  color: active || done ? 'var(--accent)' : 'var(--muted)',
                  border: `1px solid ${active || done ? 'color-mix(in srgb, var(--accent) 35%, transparent)' : 'var(--border)'}`,
                }}
              >
                {done ? '✓' : i + 1}
              </span>
              <span className="hidden xs:inline sm:inline">{s.label}</span>
            </span>
          </div>
        );
      })}
    </nav>
  );
}
