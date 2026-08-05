import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Le Pacte silencieux',
  description:
    'Une présence douce entre deux inconnus, sans conversation, sans profil, sans bruit.',
  openGraph: {
    title: 'Le Pacte silencieux',
    description:
      'Une présence douce entre deux inconnus, sans conversation, sans profil, sans bruit.',
    type: 'website',
  },
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
