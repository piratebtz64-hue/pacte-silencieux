import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Le Pacte silencieux',
    short_name: 'Pacte',
    description:
      'Présence anonyme entre pairs — gestes et messages, sans chat libre.',
    start_url: '/',
    display: 'standalone',
    background_color: '#f5f2eb',
    theme_color: '#1a5c58',
    lang: 'fr',
    orientation: 'portrait-primary',
    icons: [
      {
        src: '/icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
        purpose: 'any',
      },
      {
        src: '/icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
        purpose: 'maskable',
      },
    ],
  };
}
