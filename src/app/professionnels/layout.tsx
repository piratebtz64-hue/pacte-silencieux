import type { Metadata } from 'next';
import { pageMeta } from '@/lib/seo';

export const metadata: Metadata = pageMeta({
  title: 'Pour les professionnels',
  description:
    'Présentation du Pacte silencieux : ce que c’est, ce que ce n’est pas, comment en parler.',
  path: '/professionnels',
});

export default function ProsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
