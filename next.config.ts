import type { NextConfig } from 'next';

const config: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  async redirects() {
    return [
      // Alias légaux
      { source: '/terms', destination: '/cgu', permanent: true },
      { source: '/privacy', destination: '/confidentialite', permanent: true },
      { source: '/privacy-policy', destination: '/confidentialite', permanent: true },
      { source: '/mentions', destination: '/mentions-legales', permanent: true },
      { source: '/cgv', destination: '/cgu', permanent: true },

      // Outils / respiration
      { source: '/respiration', destination: '/outils?outil=breath', permanent: false },
      { source: '/respirations', destination: '/outils?outil=breath', permanent: false },
      { source: '/breath', destination: '/outils?outil=breath', permanent: false },
      { source: '/coherence', destination: '/outils?outil=coherence', permanent: false },
      { source: '/coherence-cardiaque', destination: '/outils?outil=coherence', permanent: false },
      { source: '/ancrage', destination: '/outils?outil=ground', permanent: false },
      { source: '/crise', destination: '/outils', permanent: false },
      { source: '/outils/respiration', destination: '/outils?outil=breath', permanent: false },
      { source: '/outils/coherence', destination: '/outils?outil=coherence', permanent: false },
      { source: '/outils/ancrage', destination: '/outils?outil=ground', permanent: false },

      // Parcours
      { source: '/commencer', destination: '/start', permanent: false },
      { source: '/inscription', destination: '/start', permanent: false },
      { source: '/login', destination: '/start', permanent: false },
      { source: '/auth', destination: '/start', permanent: false },
      { source: '/attente', destination: '/waiting', permanent: false },
      { source: '/match', destination: '/waiting', permanent: false },
      { source: '/empathie', destination: '/selection', permanent: false },
      { source: '/test', destination: '/selection', permanent: false },

      // Pacte (FR)
      { source: '/pacte/:id', destination: '/pact/:id', permanent: false },
      { source: '/pactes/:id', destination: '/pact/:id', permanent: false },

      // Dons / pro
      { source: '/donation', destination: '/don', permanent: false },
      { source: '/donate', destination: '/don', permanent: false },
      { source: '/soutenir', destination: '/don', permanent: false },
      { source: '/pro', destination: '/professionnels', permanent: false },
      { source: '/professionel', destination: '/professionnels', permanent: false },
      { source: '/professionnels/', destination: '/professionnels', permanent: true },

      // Aide
      { source: '/aide', destination: '/#aide', permanent: false },
      { source: '/urgence', destination: '/#aide', permanent: false },
      { source: '/helpline', destination: '/#aide', permanent: false },
    ];
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
      {
        source: '/',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, s-maxage=60, stale-while-revalidate=300',
          },
        ],
      },
      {
        source: '/start',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, s-maxage=60, stale-while-revalidate=300',
          },
        ],
      },
      {
        source: '/outils',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, s-maxage=60, stale-while-revalidate=300',
          },
        ],
      },
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};

export default config;
