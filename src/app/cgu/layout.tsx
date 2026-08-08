import type { Metadata } from 'next';
import { pageMeta } from '@/lib/seo';

export const metadata: Metadata = pageMeta({
  title: 'Conditions d’utilisation',
  description: 'Conditions générales d’utilisation du Pacte silencieux.',
  path: '/cgu',
});

export default function CguLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
