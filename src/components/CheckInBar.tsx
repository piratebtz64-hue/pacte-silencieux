'use client';

/**
 * Check-in silencieux — un tap, pas de phrase longue.
 * Reste dans l’ADN : geste, pas chat.
 */
const CHECKINS = [
  { type: 'CHECK_IN', label: 'Toujours là' },
  { type: 'JE_SUIS_LA', label: 'Je suis là' },
  { type: 'RECU', label: 'Reçu' },
  { type: 'DOUCEMENT', label: 'Doucement' },
] as const;

export default function CheckInBar({
  onSend,
  disabled,
}: {
  onSend: (type: string) => void;
  disabled?: boolean;
}) {
  return (
    <div
      className="mt-5 p-3 rounded-2xl border"
      style={{
        borderColor: 'var(--border)',
        background: 'var(--card-solid)',
      }}
    >
      <p
        className="text-[10px] uppercase tracking-[0.12em] font-semibold mb-2.5 text-center"
        style={{ color: 'var(--muted)' }}
      >
        Check-in silencieux
      </p>
      <div className="flex flex-wrap justify-center gap-2">
        {CHECKINS.map((c) => (
          <button
            key={c.type}
            type="button"
            disabled={disabled}
            onClick={() => onSend(c.type)}
            className="px-3.5 py-2 rounded-full text-xs font-semibold border disabled:opacity-50"
            style={{
              borderColor: 'color-mix(in srgb, var(--accent) 25%, var(--border))',
              background: 'var(--accent-soft)',
              color: 'var(--accent)',
            }}
          >
            {c.label}
          </button>
        ))}
      </div>
    </div>
  );
}
