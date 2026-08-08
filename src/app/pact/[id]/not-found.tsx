import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function PactNotFound() {
  return (
    <main className="min-h-screen flex flex-col">
      <Header />
      <section className="flex-1 grid place-items-center py-16 px-4">
        <div className="max-w-md text-center">
          <h1 className="font-serif text-2xl tracking-tight">
            Pacte introuvable
          </h1>
          <p className="mt-3 text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>
            Ce lien ne correspond à aucun pacte actif, ou le pacte a expiré.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/start" className="btn-primary text-center">
              Nouveau pacte
            </Link>
            <Link href="/" className="btn-ghost text-center">
              Accueil
            </Link>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
