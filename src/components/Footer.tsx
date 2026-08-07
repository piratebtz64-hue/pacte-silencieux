import Link from 'next/link';
import Logo from './Logo';
import DonationButton from './DonationButton';
import ShareButton from './ShareButton';

export default function Footer() {
  return (
    <footer className="border-t border-black/10 dark:border-white/10 py-10">
      <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex flex-col items-center sm:items-start gap-2">
          <Logo />
          <p className="text-xs text-[#a49f96]">
            Un espace d’entraide sociale discrète
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-sm">
          <Link href="/start" className="text-[#1f6b67] font-bold hover:underline">
            Commencer
          </Link>
          <Link href="/#aide" className="text-[#706b63] hover:underline">
            Aide
          </Link>
          <ShareButton label="Partager" />
          <DonationButton />
        </div>
      </div>

      <nav className="mt-8 flex flex-wrap justify-center gap-x-4 gap-y-2 text-xs text-[#a49f96]">
        <Link href="/confidentialite" className="hover:text-[#1f6b67] hover:underline">
          Confidentialité
        </Link>
        <Link href="/mentions-legales" className="hover:text-[#1f6b67] hover:underline">
          Mentions légales
        </Link>
        <Link href="/cgu" className="hover:text-[#1f6b67] hover:underline">
          Conditions d’utilisation
        </Link>
        <Link href="/contact" className="hover:text-[#1f6b67] hover:underline">
          Contact
        </Link>
        <Link href="/signaler" className="hover:text-[#1f6b67] hover:underline">
          Signaler un problème
        </Link>
      </nav>

      <p className="mt-6 text-center text-xs text-[#a49f96]">
        Ne remplace pas une aide professionnelle · En détresse : 3114 (France)
      </p>
    </footer>
  );
}
