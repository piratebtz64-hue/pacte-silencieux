'use client';

import Link from 'next/link';

export default function DonationButton({ className = '' }: { className?: string }) {
  return (
    <Link
      href="/don"
      className={`px-4 py-2 rounded-full bg-[#1f6b67]/10 text-[#1f6b67] font-bold hover:bg-[#1f6b67]/20 transition ${className}`}
    >
      Faire un don
    </Link>
  );
}
