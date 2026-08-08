import Link from 'next/link';
import Logo from './Logo';
import DonationButton from './DonationButton';
import ShareButton from './ShareButton';

export default function Footer() {
  return (
    <footer
      className="border-t mt-auto"
      style={{ borderColor: 'var(--border)' }}
    >
      <div className="max-w-6xl mx-auto px-4 py-14">
        <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-10">
          <div className="flex flex-col items-center md:items-start gap-3 max-w-xs text-center md:text-left">
            <Link href="/">
              <Logo />
            </Link>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>
              Présence anonyme entre pairs. Messages déjà écrits. Aucun chat
              libre.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link href="/start" className="btn-primary !py-2.5 !px-5 !text-sm">
              Commencer
            </Link>
            <Link href="/outils" className="btn-ghost !py-2.5 !px-5 !text-sm">
              Respiration et outils
            </Link>
            <Link href="/selection" className="btn-ghost !py-2.5 !px-5 !text-sm">
              Sélection
            </Link>
            <Link href="/#aide" className="btn-ghost !py-2.5 !px-5 !text-sm">
              Aide
            </Link>
            <ShareButton label="Partager" />
            <DonationButton />
          </div>
        </div>

        <div className="divider my-10" />

        <nav
          className="flex flex-wrap justify-center gap-x-5 gap-y-2 text-xs"
          style={{ color: 'var(--muted)' }}
        >
          {[
            ['/outils', 'Outils (respiration, ancrage)'],
            ['/outils?outil=coherence', 'Cohérence cardiaque'],
            ['/selection', 'Sélection empathique'],
            ['/don', 'Soutenir le projet'],
            ['/confidentialite', 'Confidentialité'],
            ['/mentions-legales', 'Mentions légales'],
            ['/cgu', 'Conditions d’utilisation'],
            ['/contact', 'Contact'],
            ['/signaler', 'Signaler un problème'],
          ].map(([href, label]) => (
            <Link
              key={href}
              href={href}
              className="hover:text-[var(--accent)] transition-colors"
            >
              {label}
            </Link>
          ))}
        </nav>

        <p
          className="mt-8 text-center text-xs"
          style={{ color: 'var(--muted)' }}
        >
          Ne remplace pas une aide professionnelle · En détresse : 3114 (France)
        </p>
      </div>
    </footer>
  );
}
