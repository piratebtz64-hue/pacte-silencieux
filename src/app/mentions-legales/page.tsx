import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function MentionsLegalesPage() {
  return (
    <main className="min-h-screen flex flex-col">
      <Header />
      <article className="flex-1 max-w-2xl mx-auto px-4 py-12">
        <Link href="/" className="text-sm text-[#706b63] hover:underline">
          ← Accueil
        </Link>
        <h1 className="mt-6 text-3xl font-serif">Mentions légales</h1>
        <div className="mt-8 space-y-6 text-[#706b63] dark:text-[#a49f96] leading-relaxed">
          <section>
            <h2 className="text-lg font-bold text-inherit mb-2">Éditeur</h2>
            <p>
              Le Pacte silencieux — projet indépendant d’entraide entre pairs.
              Contact : via la page{' '}
              <Link href="/contact" className="text-[#1f6b67] underline">
                Contact
              </Link>
              .
            </p>
          </section>
          <section>
            <h2 className="text-lg font-bold text-inherit mb-2">Hébergeur</h2>
            <p>Vercel Inc. — vercel.com</p>
          </section>
          <section>
            <h2 className="text-lg font-bold text-inherit mb-2">Nature du service</h2>
            <p>
              Service gratuit de présence anonyme entre pairs, avec messages et
              gestes prédéfinis. Ne constitue pas un service de santé, ni un
              accompagnement social ou psychologique professionnel.
            </p>
          </section>
        </div>
      </article>
      <Footer />
    </main>
  );
}
