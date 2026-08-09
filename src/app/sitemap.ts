import type { MetadataRoute } from 'next';

const siteUrl =
  process.env.NEXT_PUBLIC_APP_URL || 'https://pacte-silencieux.vercel.app';

const paths: {
  path: string;
  priority: number;
  changeFrequency: MetadataRoute.Sitemap[0]['changeFrequency'];
}[] = [
  { path: '', priority: 1, changeFrequency: 'weekly' },
  { path: '/start', priority: 0.9, changeFrequency: 'monthly' },
  { path: '/outils', priority: 0.85, changeFrequency: 'monthly' },
  { path: '/selection', priority: 0.7, changeFrequency: 'monthly' },
  { path: '/faq', priority: 0.75, changeFrequency: 'monthly' },
  { path: '/pour-un-proche', priority: 0.7, changeFrequency: 'monthly' },
  { path: '/waiting', priority: 0.5, changeFrequency: 'monthly' },
  { path: '/don', priority: 0.5, changeFrequency: 'yearly' },
  { path: '/professionnels', priority: 0.4, changeFrequency: 'yearly' },
  { path: '/contact', priority: 0.3, changeFrequency: 'yearly' },
  { path: '/signaler', priority: 0.3, changeFrequency: 'yearly' },
  { path: '/confidentialite', priority: 0.3, changeFrequency: 'yearly' },
  { path: '/mentions-legales', priority: 0.2, changeFrequency: 'yearly' },
  { path: '/cgu', priority: 0.2, changeFrequency: 'yearly' },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return paths.map(({ path, priority, changeFrequency }) => ({
    url: `${siteUrl}${path}`,
    lastModified: now,
    changeFrequency,
    priority,
  }));
}
