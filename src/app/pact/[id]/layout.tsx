import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Ton pacte',
  description: 'Espace privé de ton pacte de présence.',
  robots: { index: false, follow: false },
};

export default function PactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
