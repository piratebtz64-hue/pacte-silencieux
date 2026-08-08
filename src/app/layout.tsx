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
      'Le Pacte silencieux — Présence anonyme quand tu n’as pas envie de parler',
    template: '%s · Le Pacte silencieux',
  },
  description:
    'Quand tu n’as pas envie de parler à quelqu’un de réel, ou que personne n’est disponible. Présence anonyme entre pairs, sans chat libre. Ne remplace pas une assistante sociale ni un professionnel de santé.',
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
      'Présence anonyme entre pairs. Pas un chat, pas un professionnel. Gratuit.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Le Pacte silencieux',
    description:
      'Quand tu n’as pas envie de parler à quelqu’un de réel — une présence discrète.',
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
