'use client';

export default function DonationButton({ className = '' }: { className?: string }) {
  const link = process.env.NEXT_PUBLIC_STRIPE_DONATION_LINK || '#';

  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className={`px-4 py-2 rounded-full bg-[#1f6b67]/10 text-[#1f6b67] font-bold hover:bg-[#1f6b67]/20 transition ${className}`}
    >
      Faire un don
    </a>
  );
}
