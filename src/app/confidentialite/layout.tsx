import type { Metadata } from 'next';
import { pageMeta } from '@/lib/seo';

export const metadata: Metadata = pageMeta({
  title: 'Confidentialité',
  description:
    'Politique de confidentialité du Pacte silencieux : données, e-mails, sessions.',
  path: '/confidentialite',
});

export default function PrivacyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
