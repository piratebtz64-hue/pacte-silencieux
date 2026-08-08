import type { Metadata } from 'next';
import { pageMeta } from '@/lib/seo';

export const metadata: Metadata = pageMeta({
  title: 'Commencer un pacte',
  description:
    'Choisis 1, 3 ou 7 jours. Inscription simple par e-mail, présence anonyme, sans chat libre.',
  path: '/start',
});

export default function StartLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
