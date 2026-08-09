import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ShareButton from '@/components/ShareButton';

export const metadata = {
  title: 'Proposer le pacte à quelqu’un',
  description:
    'Comment inviter un proche à tester Le Pacte silencieux à deux, sans pression.',
};

export default function PourUnProchePage() {
  return (
    <main className="min-h-screen flex flex-col">
      <Header />
      <section className="flex-1 py-12 md:py-16">
        <div className="max-w-lg mx-auto px-4 animate-fade-up">
          <p className="section-label">Diffuser</p>
          <h1 className="mt-3 font-serif text-3xl tracking-tight leading-tight">
            Proposer le pacte à quelqu’un
          </h1>
          <p
            className="mt-4 text-sm leading-relaxed"
            style={{ color: 'var(--muted)' }}
          >
            Le site marche surtout à deux. Voici un moyen simple d’inviter un
            ami, un collègue ou un proche — sans le forcer.
          </p>

          <div className="card-premium mt-8 p-5 text-sm leading-relaxed space-y-3">
            <p className="font-semibold" style={{ color: 'var(--accent)' }}>
              En 2 minutes
            </p>
            <p>1. Chacun ouvre le site (téléphones différents).</p>
            <p>2. Chacun s’inscrit avec <strong>son</strong> email.</p>
            <p>3. Même durée (ex. 3 jours).</p>
            <p>4. Les deux restent sur la page « En attente ».</p>
            <p>5. Le match ouvre le pacte ; messages et gestes déjà écrits.</p>
          </div>

          <div
            className="mt-6 p-5 rounded-2xl text-sm leading-relaxed"
            style={{ background: 'var(--mist)', color: 'var(--muted)' }}
          >
            <p className="font-semibold" style={{ color: 'var(--accent)' }}>
              Ce que ce n’est pas
            </p>
            <p className="mt-2">
              Pas un chat libre, pas un thérapeute, pas une urgence. En détresse :
              3114 · 15 · 112.
            </p>
          </div>

          <div className="mt-10 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
            <ShareButton variant="primary" label="Partager le lien" />
            <Link href="/start" className="btn-ghost text-center min-h-[48px]">
              Commencer un pacte
            </Link>
          </div>

          <Link
            href="/"
            className="mt-10 inline-block text-sm"
            style={{ color: 'var(--muted)' }}
          >
            ← Accueil
          </Link>
        </div>
      </section>
      <Footer />
    </main>
  );
}
