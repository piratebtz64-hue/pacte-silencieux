'use client';

import { useEffect, useRef } from 'react';
import {
  STRIPE_BUY_BUTTON_ID,
  STRIPE_PUBLISHABLE_KEY,
  DONATION_LINK,
} from '@/lib/donation';

/**
 * Bouton de paiement Stripe officiel (Buy Button).
 * Charge le script une seule fois, puis affiche le web component.
 */
export default function StripeBuyButton() {
  const loaded = useRef(false);

  useEffect(() => {
    if (loaded.current) return;
    loaded.current = true;

    if (!document.querySelector('script[data-stripe-buy-button]')) {
      const script = document.createElement('script');
      script.src = 'https://js.stripe.com/v3/buy-button.js';
      script.async = true;
      script.setAttribute('data-stripe-buy-button', 'true');
      document.body.appendChild(script);
    }
  }, []);

  return (
    <div className="w-full flex flex-col items-center gap-4">
      {/* @ts-expect-error web component Stripe */}
      <stripe-buy-button
        buy-button-id={STRIPE_BUY_BUTTON_ID}
        publishable-key={STRIPE_PUBLISHABLE_KEY}
      />

      <a
        href={DONATION_LINK}
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm text-[#1f6b67] underline underline-offset-2"
      >
        Ou ouvrir la page de paiement
      </a>
    </div>
  );
}
