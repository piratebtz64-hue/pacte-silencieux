'use client';

import { useState } from 'react';

const APP_URL =
  typeof window !== 'undefined'
    ? window.location.origin
    : 'https://pacte-silencieux.vercel.app';

const SHARE_TEXT =
  'Le Pacte silencieux — une présence anonyme, sans chat, pendant quelques jours. Gratuit.';

export default function ShareButton({
  className = '',
  label = 'Partager',
  url,
  text = SHARE_TEXT,
}: {
  className?: string;
  label?: string;
  url?: string;
  text?: string;
}) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const shareUrl = url || APP_URL;

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
        /* user cancelled or not supported */
      }
    }
    setOpen((v) => !v);
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
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
      name: 'X / Twitter',
      href: `https://twitter.com/intent/tweet?text=${encodedText}&url=${encoded}`,
    },
    {
      name: 'WhatsApp',
      href: `https://wa.me/?text=${encodedText}%20${encoded}`,
    },
    {
      name: 'Facebook',
      href: `https://www.facebook.com/sharer/sharer.php?u=${encoded}`,
    },
    {
      name: 'LinkedIn',
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encoded}`,
    },
    {
      name: 'E-mail',
      href: `mailto:?subject=${encodeURIComponent('Le Pacte silencieux')}&body=${encodedText}%0A%0A${encoded}`,
    },
  ];

  return (
    <div className={`relative inline-block ${className}`}>
      <button
        type="button"
        onClick={nativeShare}
        className="px-4 py-2 rounded-full border border-black/10 dark:border-white/10 text-sm font-bold hover:border-[#1f6b67] hover:text-[#1f6b67] transition"
      >
        {label}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-52 rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#1a1c1a] shadow-lg z-50 p-2">
          {links.map((l) => (
            <a
              key={l.name}
              href={l.href}
              target="_blank"
              rel="noopener noreferrer"
              className="block px-3 py-2 text-sm rounded-lg hover:bg-[#1f6b67]/10"
              onClick={() => setOpen(false)}
            >
              {l.name}
            </a>
          ))}
          <button
            type="button"
            onClick={copy}
            className="w-full text-left px-3 py-2 text-sm rounded-lg hover:bg-[#1f6b67]/10 font-medium"
          >
            {copied ? 'Lien copié ✓' : 'Copier le lien'}
          </button>
        </div>
      )}
    </div>
  );
}
