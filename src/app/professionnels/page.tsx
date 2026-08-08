import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'Pour les professionnels',
  description:
    'Le Pacte silencieux pour assistantes sociales et acteurs de l’accompagnement — outil complémentaire, gratuit, sans chat libre.',
};

export default function ProfessionnelsPage() {
  return (
    <main className="min-h-screen flex flex-col">
      <Header />
      <article className="flex-1 py-14 md:py-20">
        <div className="max-w-2xl mx-auto px-4">
          <p className="badge">Professionnels · terrain</p>
          <h1 className="mt-5 font-serif text-3xl md:text-4xl tracking-tight leading-snug">
            Un outil de présence, pas un substitut au lien pro
          </h1>
          <p className="mt-5 text-base leading-relaxed" style={{ color: 'var(--muted)' }}>
            Le Pacte silencieux est conçu pour les moments où la personne n’a
            personne de disponible près d’elle — le soir, le weekend, entre deux
            rendez-vous. Il ne remplace ni l’assistante sociale, ni le psychologue,
            ni le médecin.
          </p>

          <section className="mt-12 space-y-6">
            <h2 className="font-serif text-xl">Ce que c’est</h2>
            <ul className="space-y-3 text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>
              <li>· Présence anonyme entre pairs, durée limitée (1, 3 ou 7 jours)</li>
              <li>· Uniquement des phrases et gestes déjà écrits — pas de chat libre</li>
              <li>· Pas de profil public, pas de photos, pas d’âge affiché</li>
              <li>· Gratuit, sans inscription complexe (email + lien magique)</li>
              <li>· Numéros d’aide officiels affichés sur le site</li>
            </ul>
          </section>

          <section className="mt-12 space-y-6">
            <h2 className="font-serif text-xl">Ce que ce n’est pas</h2>
            <ul className="space-y-3 text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>
              <li>· Pas une prise en charge sociale ou médicale</li>
              <li>· Pas une ligne d’écoute professionnelle</li>
              <li>· Pas un réseau social ni un forum</li>
              <li>· Pas adapté seul en situation de crise vitale (orienter vers 15 / 112 / 3114)</li>
            </ul>
          </section>

          <section className="mt-12 space-y-4">
            <h2 className="font-serif text-xl">Comment le proposer</h2>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>
              Vous pouvez partager le lien :{' '}
              <strong style={{ color: 'var(--foreground)' }}>
                https://pacte-silencieux.vercel.app
              </strong>
              . Expliquer en une phrase : « Si un soir tu te sens seul·e et que
              personne n’est dispo, il y a un espace anonyme avec des messages déjà
              écrits — ce n’est pas un pro, c’est une présence entre pairs. »
            </p>
          </section>

          <div className="mt-12 flex flex-wrap gap-3">
            <Link href="/" className="btn-primary">
              Voir le site
            </Link>
            <Link href="/#aide" className="btn-ghost">
              Numéros d’aide
            </Link>
          </div>
        </div>
      </article>
      <Footer />
    </main>
  );
}
