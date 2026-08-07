import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function ContactPage() {
  return (
    <main className="min-h-screen flex flex-col">
      <Header />
      <article className="flex-1 max-w-2xl mx-auto px-4 py-12">
        <Link href="/" className="text-sm text-[#706b63] hover:underline">
          ← Accueil
        </Link>
        <h1 className="mt-6 text-3xl font-serif">Contact</h1>
        <p className="mt-4 text-[#706b63] dark:text-[#a49f96] leading-relaxed">
          Pour une question sur le service, une demande RGPD (suppression
          d’e-mail), ou un signalement : écris à l’adresse associée au projet
          (indiquée sur ta page de don Stripe / compte de déploiement) ou utilise{' '}
          <Link href="/signaler" className="text-[#1f6b67] underline">
            Signaler un problème
          </Link>
          .
        </p>
        <p className="mt-4 text-[#706b63] dark:text-[#a49f96] leading-relaxed">
          En urgence vitale ou détresse : <strong>3114</strong>, <strong>15</strong> ou{' '}
          <strong>112</strong> (France). Ce site n’est pas un service d’urgence.
        </p>
      </article>
      <Footer />
    </main>
  );
}
