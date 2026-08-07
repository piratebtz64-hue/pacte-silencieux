'use client';

import Link from 'next/link';

export default function DonationButton({ className = '' }: { className?: string }) {
  // Priorité : lien PayPal, sinon Stripe, sinon page /don
  const paypal = process.env.NEXT_PUBLIC_PAYPAL_DONATION_LINK;
  const stripe = process.env.NEXT_PUBLIC_STRIPE_DONATION_LINK;
  const external =
    paypal && paypal.startsWith('http')
      ? paypal
      : stripe && stripe.startsWith('http')
        ? stripe
        : null;

  if (external) {
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

  return (
    <Link
      href="/don"
      className={`px-4 py-2 rounded-full bg-[#1f6b67]/10 text-[#1f6b67] font-bold hover:bg-[#1f6b67]/20 transition ${className}`}
    >
      Faire un don
    </Link>
  );
}
