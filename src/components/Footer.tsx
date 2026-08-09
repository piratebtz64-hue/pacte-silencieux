import Link from 'next/link';
import Logo from './Logo';
import DonationButton from './DonationButton';
import ShareButton from './ShareButton';

export default function Footer() {
  return (
    <footer className="border-t mt-auto" style={{ borderColor: 'var(--border)' }}>
      <div className="max-w-5xl mx-auto px-4 py-16">
        <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-12">
          <div className="flex flex-col items-center md:items-start gap-4 max-w-sm text-center md:text-left">
            <Link href="/">
              <Logo />
            </Link>
            <p
              className="text-sm leading-relaxed"
              style={{ color: 'var(--muted)' }}
            >
              Présence anonyme entre pairs. Gestes et messages déjà écrits.
              Aucun chat libre.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2.5">
            <Link href="/start" className="btn-primary !py-2.5 !px-5 !text-sm">
              Commencer
            </Link>
            <Link href="/outils" className="btn-ghost !py-2.5 !px-5 !text-sm">
              Outils
            </Link>
            <ShareButton label="Partager" />
            <DonationButton />
          </div>
        </div>

        <div className="divider my-12" />

        <nav
          className="flex flex-wrap justify-center gap-x-6 gap-y-2.5 text-xs"
          style={{ color: 'var(--muted)' }}
        >
          {[
            ['/outils', 'Respiration'],
            ['/outils?outil=coherence', 'Cohérence'],
            ['/selection', 'Sélection'],
            ['/don', 'Soutenir'],
            ['/confidentialite', 'Confidentialité'],
            ['/mentions-legales', 'Mentions'],
            ['/cgu', 'CGU'],
            ['/contact', 'Contact'],
            ['/signaler', 'Signaler'],
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
          className="mt-10 text-center text-xs tracking-wide"
          style={{ color: 'var(--muted)' }}
        >
          Ne remplace pas une aide professionnelle · En détresse : 3114
        </p>
      </div>
    </footer>
  );
}
