import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function NotFound() {
  return (
    <main className="min-h-screen flex flex-col">
      <Header />
      <section className="flex-1 grid place-items-center py-16 px-4">
        <div className="max-w-md text-center">
          <p
            className="text-xs font-bold uppercase tracking-[0.14em]"
            style={{ color: 'var(--accent)' }}
          >
            Erreur 404
          </p>
          <h1 className="mt-3 font-serif text-3xl tracking-tight">
            Cette page n’existe pas
          </h1>
          <p className="mt-4 text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>
            Le lien est peut-être ancien ou incomplet. Tu peux revenir à
            l’accueil, commencer un pacte, ou ouvrir les outils de respiration.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/" className="btn-primary text-center">
              Accueil
            </Link>
            <Link href="/start" className="btn-ghost text-center">
              Commencer un pacte
            </Link>
            <Link href="/outils" className="btn-ghost text-center">
              Outils
            </Link>
          </div>
          <ul
            className="mt-10 text-left text-xs space-y-2 p-4 rounded-xl"
            style={{ background: 'var(--accent-soft)', color: 'var(--muted)' }}
          >
            <li>
              <Link href="/waiting" className="underline">
                /waiting
              </Link>{' '}
              — file d’attente
            </li>
            <li>
              <Link href="/selection" className="underline">
                /selection
              </Link>{' '}
              — sélection empathique
            </li>
            <li>
              <Link href="/don" className="underline">
                /don
              </Link>{' '}
              — soutenir le projet
            </li>
            <li>
              <Link href="/#aide" className="underline">
                /#aide
              </Link>{' '}
              — numéros d’aide
            </li>
          </ul>
        </div>
      </section>
      <Footer />
    </main>
  );
}
