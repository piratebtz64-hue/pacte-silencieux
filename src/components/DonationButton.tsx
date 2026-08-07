'use client';

import Link from 'next/link';

export default function DonationButton({ className = '' }: { className?: string }) {
  const link =
    process.env.NEXT_PUBLIC_PAYPAL_DONATION_LINK ||
    process.env.NEXT_PUBLIC_STRIPE_DONATION_LINK ||
    '';

  const classNames = `px-4 py-2 rounded-full bg-[#1f6b67]/10 text-[#1f6b67] font-bold hover:bg-[#1f6b67]/20 transition ${className}`;

  if (link.startsWith('http')) {
    return (
      <a href={link} target="_blank" rel="noopener noreferrer" className={classNames}>
        Faire un don
      </a>
    );
  }

  return (
    <Link href="/don" className={classNames}>
      Faire un don
    </Link>
  );
}
