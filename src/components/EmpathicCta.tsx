import Link from 'next/link';

/** Boutons d’entrée sélection empathique */
export default function EmpathicCta() {
  return (
    <div className="flex flex-wrap gap-3 items-center">
      <Link href="/start" className="btn-primary">
        Commencer un pacte de présence
      </Link>
      <Link href="/selection" className="btn-ghost">
        Comment tu te sens ?
      </Link>
    </div>
  );
}
