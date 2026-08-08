import type { Metadata } from 'next';
import { pageMeta } from '@/lib/seo';

export const metadata: Metadata = pageMeta({
  title: 'Respiration et outils',
  description:
    'Cohérence cardiaque, respirations guidées, ancrage 5-4-3-2-1 et pleine conscience. Outils gratuits de stabilisation.',
  path: '/outils',
});

export default function OutilsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
