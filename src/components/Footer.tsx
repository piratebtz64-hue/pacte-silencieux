import DonationButton from './DonationButton';

export default function Footer() {
  return (
    <footer className="py-12 border-t border-black/10 dark:border-white/10">
      <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-[#706b63] dark:text-[#a49f96]">
        <span>
          Le Pacte silencieux — une présence discrète, pas une conversation.
        </span>
        <DonationButton />
      </div>
    </footer>
  );
}
