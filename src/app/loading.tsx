export default function Loading() {
  return (
    <main className="min-h-screen grid place-items-center">
      <div className="text-center">
        <div className="pact-breath mx-auto" />
        <p className="mt-4 text-sm" style={{ color: 'var(--muted)' }}>
          Chargement…
        </p>
      </div>
    </main>
  );
}
