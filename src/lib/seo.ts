const siteUrl =
  process.env.NEXT_PUBLIC_APP_URL || 'https://pacte-silencieux.vercel.app';

export const SITE = {
  name: 'Le Pacte silencieux',
  shortName: 'Pacte silencieux',
  url: siteUrl,
  locale: 'fr_FR',
  description:
    'Présence anonyme entre pairs : gestes et messages déjà écrits, sans chat libre. Un complément quand personne n’est disponible près de toi — ne remplace pas un professionnel de santé.',
  keywords: [
    'soutien anonyme',
    'pacte silencieux',
    'présence discrète',
    'messages de soutien',
    'sans chat libre',
    'solitude',
    'entraide',
    'respiration',
    'cohérence cardiaque',
    'ancrage',
    'France',
  ],
} as const;

export function absoluteUrl(path = '/') {
  const p = path.startsWith('/') ? path : `/${path}`;
  return `${SITE.url}${p === '/' ? '' : p}`;
}

export function pageMeta({
  title,
  description,
  path = '/',
  noIndex = false,
}: {
  title: string;
  description: string;
  path?: string;
  noIndex?: boolean;
}) {
  const url = absoluteUrl(path);
  return {
    title,
    description,
    keywords: [...SITE.keywords],
    alternates: { canonical: url },
    openGraph: {
      type: 'website' as const,
      locale: SITE.locale,
      url,
      siteName: SITE.name,
      title: `${title} · ${SITE.name}`,
      description,
    },
    twitter: {
      card: 'summary_large_image' as const,
      title: `${title} · ${SITE.name}`,
      description,
    },
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
  };
}

/** JSON-LD WebSite + WebApplication */
export function websiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': `${SITE.url}/#website`,
        url: SITE.url,
        name: SITE.name,
        description: SITE.description,
        inLanguage: 'fr-FR',
        publisher: {
          '@type': 'Organization',
          name: SITE.name,
          url: SITE.url,
        },
      },
      {
        '@type': 'WebApplication',
        name: SITE.name,
        url: SITE.url,
        applicationCategory: 'HealthApplication',
        operatingSystem: 'Web',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'EUR',
        },
        description: SITE.description,
        inLanguage: 'fr-FR',
      },
    ],
  };
}
