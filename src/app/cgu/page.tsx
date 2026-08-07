import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function CguPage() {
  return (
    <main className="min-h-screen flex flex-col">
      <Header />
      <article className="flex-1 max-w-2xl mx-auto px-4 py-12">
        <Link href="/" className="text-sm text-[#706b63] hover:underline">
          ← Accueil
        </Link>
        <h1 className="mt-6 text-3xl font-serif">Conditions d’utilisation</h1>
        <div className="mt-8 space-y-6 text-[#706b63] dark:text-[#a49f96] leading-relaxed">
          <p>
            En utilisant Le Pacte silencieux, tu acceptes un cadre strict :
            messages et gestes uniquement prédéfinis, pas d’échange libre, pas
            de contact direct entre participants.
          </p>
          <p>
            Il est interdit d’utiliser le service pour harceler, menacer,
            diffuser du contenu illégal ou tenter de contourner l’anonymat pour
            identifier autrui.
          </p>
          <p>
            Tu peux arrêter un pacte à tout moment en quittant le service. En
            cas de comportement inapproprié, utilise{' '}
            <Link href="/signaler" className="text-[#1f6b67] underline">
              Signaler un problème
            </Link>
            .
          </p>
          <p>
            Le service est fourni « en l’état », sans garantie de disponibilité
            permanente ni de mise en relation immédiate.
          </p>
        </div>
      </article>
      <Footer />
    </main>
  );
}
