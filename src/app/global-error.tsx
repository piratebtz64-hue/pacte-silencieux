'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="fr">
      <body
        style={{
          margin: 0,
          fontFamily: 'system-ui, sans-serif',
          background: '#f2f4ef',
          color: '#1a2e2a',
          minHeight: '100vh',
          display: 'grid',
          placeItems: 'center',
          padding: 24,
        }}
      >
        <div style={{ maxWidth: 420, textAlign: 'center' }}>
          <h1 style={{ fontSize: 24, fontWeight: 600 }}>Erreur critique</h1>
          <p style={{ marginTop: 12, fontSize: 14, opacity: 0.75 }}>
            L’application n’a pas pu s’afficher. Réessaie ou recharge la page.
          </p>
          {error.digest && (
            <p style={{ marginTop: 8, fontSize: 11, opacity: 0.55 }}>
              Réf. {error.digest}
            </p>
          )}
          <button
            type="button"
            onClick={reset}
            style={{
              marginTop: 24,
              padding: '10px 18px',
              borderRadius: 999,
              border: 'none',
              background: '#2f6f66',
              color: '#fff',
              cursor: 'pointer',
              fontWeight: 600,
            }}
          >
            Réessayer
          </button>
        </div>
      </body>
    </html>
  );
}
