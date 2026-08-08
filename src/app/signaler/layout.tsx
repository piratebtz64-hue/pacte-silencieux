import type { Metadata } from 'next';
import { pageMeta } from '@/lib/seo';

export const metadata: Metadata = pageMeta({
  title: 'Signaler un problème',
  description: 'Signaler un contenu ou un comportement sur Le Pacte silencieux.',
  path: '/signaler',
  noIndex: true,
});

export default function SignalerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
