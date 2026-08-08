import type { Metadata } from 'next';
import { pageMeta } from '@/lib/seo';

export const metadata: Metadata = pageMeta({
  title: 'Mentions légales',
  description: 'Mentions légales du site Le Pacte silencieux.',
  path: '/mentions-legales',
});

export default function MentionsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
