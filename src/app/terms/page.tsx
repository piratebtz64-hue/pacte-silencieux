'use client';

import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function TermsPage() {
  return (
    <main className="min-h-screen flex flex-col">
      <Header />

      <section className="flex-1 py-16">
        <div className="max-w-3xl mx-auto px-4">
          <Link
            href="/"
            className="text-sm text-[#706b63] dark:text-[#a49f96] hover:underline"
          >
            ← Retour à l'accueil
          </Link>

          <article className="mt-8 prose dark:prose-invert max-w-none">
            <h1 className="text-4xl font-serif">Conditions d'utilisation</h1>

            <h2 className="text-2xl font-serif mt-8">Acceptation des conditions</h2>
            <p>
              En utilisant Le Pacte silencieux, vous acceptez ces conditions
              d'utilisation. Si vous n'êtes pas d'accord, veuillez ne pas
              utiliser l'application.
            </p>

            <h2 className="text-2xl font-serif mt-8">Code de conduite</h2>
            <p>Les utilisateurs s'engagent à:</p>
            <ul>
              <li>Respecter la dignité et l'intimité de leur partenaire</li>
              <li>Ne pas utiliser l'application pour du harcèlement</li>
              <li>Ne pas tenter de contourner les mesures de sécurité</li>
              <li>Accepter la nature silencieuse et limite de l'application</li>
            </ul>

            <h2 className="text-2xl font-serif mt-8">Modération</h2>
            <p>
              Tout comportement abusif, harcelant ou inapproprié peut entraîner
              une suspension ou une suppression de compte sans préavis.
            </p>

            <h2 className="text-2xl font-serif mt-8">Responsabilité</h2>
            <p>
              Le Pacte silencieux est fourni "tel quel" sans garantie. Nous ne
              sommes pas responsables des dommages directs ou indirects résultant
              de l'utilisation de l'application.
            </p>

            <h2 className="text-2xl font-serif mt-8">Modifications</h2>
            <p>
              Nous nous réservons le droit de modifier ces conditions à tout
              moment. Les modifications seront communiquées sur cette page.
            </p>
          </article>
        </div>
      </section>

      <Footer />
    </main>
  );
}
