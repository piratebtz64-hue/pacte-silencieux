import './globals.css';
import type { Metadata, Viewport } from 'next';
import PwaRegister from '@/components/PwaRegister';
import InstallHint from '@/components/InstallHint';

const siteUrl =
  process.env.NEXT_PUBLIC_APP_URL || 'https://pacte-silencieux.vercel.app';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default:
      'Le Pacte silencieux — Soutien anonyme quand personne n’est disponible',
    template: '%s · Le Pacte silencieux',
  },
  description:
    'Quand personne n’est près de toi pour en parler et que tu as besoin d’un peu de soutien. Présence anonyme entre pairs, sans chat libre. Complément — ne remplace pas une assistante sociale ni un professionnel de santé.',
  keywords: [
    'pacte silencieux',
    'soutien anonyme',
    'présence discrète',
    'messages de soutien',
    'sans chat',
    'solitude',
  ],
  applicationName: 'Le Pacte silencieux',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Pacte silencieux',
  },
  formatDetection: { telephone: true },
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: siteUrl,
    siteName: 'Le Pacte silencieux',
    title: 'Le Pacte silencieux',
    description:
      'Quand personne n’est disponible près de toi — une présence anonyme entre pairs. Gratuit.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Le Pacte silencieux',
    description:
      'Soutien anonyme quand l’entourage n’est pas là. Pas un remplacement des professionnels.',
  },
  robots: { index: true, follow: true },
  alternates: { canonical: siteUrl },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f5f2eb' },
    { media: '(prefers-color-scheme: dark)', color: '#0b0c0a' },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className="min-h-screen antialiased">
        {children}
        <PwaRegister />
        <InstallHint />
      </body>
    </html>
  );
}
