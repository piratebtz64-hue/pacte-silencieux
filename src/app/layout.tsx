import './globals.css';
import type { Metadata, Viewport } from 'next';

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://pacte-silencieux.vercel.app';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Le Pacte silencieux — Une présence anonyme, sans chat',
    template: '%s · Le Pacte silencieux',
  },
  description:
    'Pendant quelques jours, quelqu’un tient avec toi. Gratuit, anonyme, sans profil ni chat libre. Gestes silencieux, messages de soutien prédéfinis et remerciements en fin de pacte.',
  keywords: [
    'pacte silencieux',
    'soutien anonyme',
    'présence discrète',
    'messages de soutien',
    'sans chat',
    'aide émotionnelle gratuite',
    'solitude',
  ],
  authors: [{ name: 'Le Pacte silencieux' }],
  creator: 'Le Pacte silencieux',
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: siteUrl,
    siteName: 'Le Pacte silencieux',
    title: 'Le Pacte silencieux — Une présence anonyme, sans chat',
    description:
      'Gratuit, anonyme, sans profil. Gestes silencieux, messages de soutien déjà écrits, remerciements en fin de pacte. Pour les jours où parler est trop lourd.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Le Pacte silencieux',
    description:
      'Pendant quelques jours, quelqu’un tient avec toi. Gratuit · Anonyme · Sans chat libre.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: siteUrl,
  },
  category: 'wellbeing',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f2eee5' },
    { media: '(prefers-color-scheme: dark)', color: '#0f0f0f' },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
