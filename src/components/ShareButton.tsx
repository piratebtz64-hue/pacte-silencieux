'use client';

import { useState } from 'react';

const DEFAULT_TEXT =
  'Le Pacte silencieux — présence anonyme, messages déjà écrits, sans chat. On peut tester à deux (même durée, page d’attente). Gratuit :';

export default function ShareButton({
  className = '',
  label = 'Inviter quelqu’un',
  url,
  text = DEFAULT_TEXT,
  variant = 'ghost',
}: {
  className?: string;
  label?: string;
  url?: string;
  text?: string;
  variant?: 'ghost' | 'primary' | 'link';
}) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const shareUrl =
    url ||
    (typeof window !== 'undefined'
      ? window.location.origin
      : 'https://pacte-silencieux.vercel.app');

  const nativeShare = async () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: 'Le Pacte silencieux',
          text,
          url: shareUrl,
        });
        return;
      } catch {
        /* cancelled */
      }
    }
    setOpen((v) => !v);
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(`${text} ${shareUrl}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setOpen(true);
    }
  };

  const encoded = encodeURIComponent(shareUrl);
  const encodedText = encodeURIComponent(text);

  const links = [
    {
      name: 'WhatsApp',
      href: `https://wa.me/?text=${encodedText}%20${encoded}`,
    },
    {
      name: 'X / Twitter',
      href: `https://twitter.com/intent/tweet?text=${encodedText}&url=${encoded}`,
    },
    {
      name: 'E-mail',
      href: `mailto:?subject=${encodeURIComponent('Le Pacte silencieux')}&body=${encodedText}%0A%0A${encoded}`,
    },
  ];

  const btnClass =
    variant === 'primary'
      ? 'btn-primary !text-sm !py-2.5 !px-4'
      : variant === 'link'
        ? 'text-sm font-semibold underline-offset-2 hover:underline'
        : 'btn-ghost !text-sm !py-2.5 !px-4';

  return (
    <div className={`relative inline-block ${className}`}>
      <button
        type="button"
        onClick={nativeShare}
        className={`${btnClass} whitespace-nowrap`}
        style={variant === 'link' ? { color: 'var(--accent)' } : undefined}
      >
        {copied ? 'Copié ✓' : label}
      </button>

      {open && (
        <div
          className="absolute right-0 mt-2 w-52 rounded-xl border shadow-lg z-50 p-2 text-left"
          style={{
            borderColor: 'var(--border)',
            background: 'var(--card-solid)',
          }}
        >
          {links.map((l) => (
            <a
              key={l.name}
              href={l.href}
              target="_blank"
              rel="noopener noreferrer"
              className="block px-3 py-2.5 text-sm rounded-lg hover:opacity-90"
              style={{ color: 'var(--foreground)' }}
              onClick={() => setOpen(false)}
            >
              {l.name}
            </a>
          ))}
          <button
            type="button"
            onClick={copy}
            className="w-full text-left px-3 py-2.5 text-sm rounded-lg font-medium"
            style={{ color: 'var(--accent)' }}
          >
            {copied ? 'Lien copié ✓' : 'Copier le message + lien'}
          </button>
        </div>
      )}
    </div>
  );
}
