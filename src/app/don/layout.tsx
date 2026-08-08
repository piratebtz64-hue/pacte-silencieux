import type { Metadata } from 'next';
import { pageMeta } from '@/lib/seo';

export const metadata: Metadata = pageMeta({
  title: 'Soutenir le projet',
  description:
    'Le Pacte silencieux est gratuit. Un don optionnel aide à faire vivre le site.',
  path: '/don',
});

export default function DonLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
