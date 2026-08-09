import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'Questions fréquentes',
  description:
    'Doutes sur Le Pacte silencieux : anonymat, match, messages, urgence, professionels.',
};

const FAQ: { q: string; a: string }[] = [
  {
    q: 'C’est quoi, concrètement ?',
    a: 'Deux personnes anonymes se relient pour 1, 3 ou 7 jours. Elles échangent seulement des gestes et des messages déjà écrits — pas de chat libre, pas de profil.',
  },
  {
    q: 'Pourquoi personne ne match avec moi ?',
    a: 'Il faut une autre personne en ligne en même temps, avec la même durée, sur la page d’attente. Si tu es seul·e, c’est normal. Tu peux tester à deux (second téléphone ou un proche) ou utiliser les outils de respiration en attendant.',
  },
  {
    q: 'Est-ce que c’est anonyme ?',
    a: 'Oui côté usage : pas de nom affiché à l’autre personne. On te demande un email pour retrouver ton pacte sur le même appareil / plus tard. Pas de chat libre.',
  },
  {
    q: 'C’est un remplacement d’un professionnel ?',
    a: 'Non. C’est un complément de présence, pas un soin, pas une thérapie, pas une assistante sociale. En détresse : 3114, 15, 112.',
  },
  {
    q: 'Je peux écrire ce que je veux ?',
    a: 'Non. Uniquement des messages et gestes proposés par le site. C’est voulu : cadre sûr, pas de dérive.',
  },
  {
    q: 'Comment tester rapidement ?',
    a: 'Deux téléphones (ou deux emails), même durée, les deux sur « En attente ». Le match s’ouvre tout seul. Voir aussi la page « Pour un proche ».',
  },
  {
    q: 'Que se passe-t-il à la fin des jours choisis ?',
    a: 'On propose de prolonger 7 jours si les deux disent oui. Sinon le pacte se termine ; tu peux relire le fil et recommencer plus tard.',
  },
  {
    q: 'Et si je vais mal ?',
    a: 'Utilise les numéros d’aide sur le site (3114 prévention suicide, 15, 112…). Le pacte n’est pas une ligne d’urgence.',
  },
];

export default function FaqPage() {
  return (
    <main className="min-h-screen flex flex-col">
      <Header />
      <section className="flex-1 py-12 md:py-16">
        <div className="max-w-lg mx-auto px-4">
          <p className="section-label">Doutes</p>
          <h1 className="mt-3 font-serif text-3xl tracking-tight leading-tight">
            Questions fréquentes
          </h1>
          <p
            className="mt-3 text-sm leading-relaxed"
            style={{ color: 'var(--muted)' }}
          >
            Réponses courtes. Si quelque chose reste flou, écris via Contact.
          </p>

          <div className="mt-10 space-y-4">
            {FAQ.map((item) => (
              <details
                key={item.q}
                className="group rounded-2xl border px-5 py-4"
                style={{
                  borderColor: 'var(--border)',
                  background: 'var(--card-solid)',
                }}
              >
                <summary className="cursor-pointer list-none font-semibold text-sm leading-snug flex justify-between gap-3">
                  {item.q}
                  <span
                    className="shrink-0 opacity-50 group-open:rotate-45 transition"
                    aria-hidden
                  >
                    +
                  </span>
                </summary>
                <p
                  className="mt-3 text-sm leading-relaxed"
                  style={{ color: 'var(--muted)' }}
                >
                  {item.a}
                </p>
              </details>
            ))}
          </div>

          <div className="mt-10 flex flex-col sm:flex-row gap-3">
            <Link href="/start" className="btn-primary text-center min-h-[48px]">
              Commencer un pacte
            </Link>
            <Link href="/pour-un-proche" className="btn-ghost text-center min-h-[48px]">
              Inviter quelqu’un
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
