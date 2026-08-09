'use client';

import { useState } from 'react';
import { SHARE_SHORT, SITE_URL, WHATSAPP_INVITE, whatsappShareHref } from '@/lib/share';

export default function ShareButton({
  className = '',
  label = 'Inviter quelqu’un',
  url,
  text,
  variant = 'ghost',
  preferWhatsApp = true,
}: {
  className?: string;
  label?: string;
  url?: string;
  text?: string;
  variant?: 'ghost' | 'primary' | 'link';
  /** Sur mobile, ouvre WhatsApp en priorité avec le message long. */
  preferWhatsApp?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const shareUrl = url || SITE_URL;
  const shortText = text || `${SHARE_SHORT}${shareUrl}`;
  const waText =
    text ||
    WHATSAPP_INVITE.replace(SITE_URL, shareUrl);

  const openWhatsApp = () => {
    window.open(whatsappShareHref(waText), '_blank', 'noopener,noreferrer');
  };

  const nativeShare = async () => {
    // Mobile : WhatsApp d’abord (meilleur taux d’ouverture)
    if (preferWhatsApp && typeof navigator !== 'undefined') {
      const ua = navigator.userAgent || '';
      const mobile = /Android|iPhone|iPad|iPod|Mobile/i.test(ua);
      if (mobile) {
        openWhatsApp();
        return;
      }
    }

    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: 'Le Pacte silencieux',
          text: shortText,
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
      await navigator.clipboard.writeText(waText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setOpen(true);
    }
  };

  const encoded = encodeURIComponent(shareUrl);
  const encodedShort = encodeURIComponent(shortText);

  const links = [
    { name: 'WhatsApp', href: whatsappShareHref(waText), primary: true },
    {
      name: 'X / Twitter',
      href: `https://twitter.com/intent/tweet?text=${encodedShort}&url=${encoded}`,
    },
    {
      name: 'E-mail',
      href: `mailto:?subject=${encodeURIComponent('Le Pacte silencieux')}&body=${encodeURIComponent(waText)}`,
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
          className="absolute right-0 mt-2 w-56 rounded-xl border shadow-lg z-50 p-2 text-left"
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
              className="block px-3 py-2.5 text-sm rounded-lg font-medium"
              style={{
                color: l.primary ? 'var(--accent)' : 'var(--foreground)',
              }}
              onClick={() => setOpen(false)}
            >
              {l.name}
              {l.primary ? ' · recommandé' : ''}
            </a>
          ))}
          <button
            type="button"
            onClick={copy}
            className="w-full text-left px-3 py-2.5 text-sm rounded-lg font-medium"
            style={{ color: 'var(--accent)' }}
          >
            {copied ? 'Message copié ✓' : 'Copier le message complet'}
          </button>
        </div>
      )}
    </div>
  );
}
