import type { Metadata } from 'next';
import { pageMeta } from '@/lib/seo';

export const metadata: Metadata = pageMeta({
  title: 'En attente',
  description: 'File d’attente pour trouver une présence avec la même durée de pacte.',
  path: '/waiting',
  noIndex: true,
});

export default function WaitingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
