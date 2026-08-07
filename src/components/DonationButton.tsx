'use client';

import Link from 'next/link';

export default function DonationButton({ className = '' }: { className?: string }) {
  const external = process.env.NEXT_PUBLIC_STRIPE_DONATION_LINK;

  // Si un lien Stripe Payment Link est configuré → ouverture directe
  if (external && external.startsWith('http')) {
    return (
      <a
        href={external}
        target="_blank"
        rel="noopener noreferrer"
        className={`px-4 py-2 rounded-full bg-[#1f6b67]/10 text-[#1f6b67] font-bold hover:bg-[#1f6b67]/20 transition ${className}`}
      >
        Faire un don
      </a>
    );
  }

  // Sinon → page don interne
  return (
    <Link
      href="/don"
      className={`px-4 py-2 rounded-full bg-[#1f6b67]/10 text-[#1f6b67] font-bold hover:bg-[#1f6b67]/20 transition ${className}`}
    >
      Faire un don
    </Link>
  );
}
