import type { Metadata } from 'next';
import { pageMeta } from '@/lib/seo';

export const metadata: Metadata = pageMeta({
  title: 'Sélection empathique',
  description:
    'Quelques questions douces pour clarifier si tu as besoin de soutien ou si tu veux en offrir. Ce n’est pas un test médical.',
  path: '/selection',
});

export default function SelectionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
