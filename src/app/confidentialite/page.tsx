import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function ConfidentialitePage() {
  return (
    <main className="min-h-screen flex flex-col">
      <Header />
      <article className="flex-1 max-w-2xl mx-auto px-4 py-12">
        <Link href="/" className="text-sm text-[#706b63] hover:underline">
          ← Accueil
        </Link>
        <h1 className="mt-6 text-3xl font-serif">Confidentialité</h1>
        <p className="mt-2 text-sm text-[#a49f96]">Dernière mise à jour : août 2026</p>

        <div className="mt-8 space-y-6 text-[#706b63] dark:text-[#a49f96] leading-relaxed">
          <section>
            <h2 className="text-lg font-bold text-inherit mb-2">Données collectées</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>Adresse e-mail (pour le lien de connexion et l’identification technique)</li>
              <li>Durée de pacte choisie et messages / gestes échangés dans le pacte</li>
              <li>Identifiants techniques anonymes (session navigateur)</li>
            </ul>
            <p className="mt-2">Aucun nom réel, aucune photo, aucun profil public.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-inherit mb-2">Usage</h2>
            <p>
              Les données servent uniquement au fonctionnement du pacte (mise en
              relation anonyme, envoi éventuel d’un lien magique, affichage des
              messages prédéfinis). Elles ne sont <strong>ni vendues ni cédées</strong> à
              des annonceurs.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-inherit mb-2">Conservation</h2>
            <p>
              Les pactes et messages associés peuvent être conservés le temps du
              fonctionnement du service, puis supprimés ou anonymisés. Tu peux
              demander la suppression de ton e-mail et des données liées.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-inherit mb-2">Tes droits (RGPD)</h2>
            <p>
              Accès, rectification, suppression, opposition. Pour exercer ces
              droits : utilise la page{' '}
              <Link href="/contact" className="text-[#1f6b67] underline">
                Contact
              </Link>
              .
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-inherit mb-2">Hébergement</h2>
            <p>
              Application hébergée sur Vercel. Base de données via Supabase
              (PostgreSQL). Connexions chiffrées (HTTPS).
            </p>
          </section>
        </div>
      </article>
      <Footer />
    </main>
  );
}
