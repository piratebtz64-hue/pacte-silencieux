'use client';

import { useEffect, useRef, useState } from 'react';
import {
  STRIPE_BUY_BUTTON_ID,
  STRIPE_PUBLISHABLE_KEY,
  STRIPE_PAYMENT_LINK,
} from '@/lib/donation';

export default function StripeBuyButton() {
  const loaded = useRef(false);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (loaded.current) return;
    loaded.current = true;

    const markReady = () => setReady(true);

    const existing = document.querySelector(
      'script[data-stripe-buy-button]'
    ) as HTMLScriptElement | null;

    if (existing) {
      if (customElements.get('stripe-buy-button')) {
        markReady();
      } else {
        existing.addEventListener('load', markReady);
      }
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://js.stripe.com/v3/buy-button.js';
    script.async = true;
    script.setAttribute('data-stripe-buy-button', 'true');
    script.onload = markReady;
    script.onerror = () => setFailed(true);
    document.body.appendChild(script);

    const t = window.setTimeout(() => {
      if (!customElements.get('stripe-buy-button')) setFailed(true);
    }, 8000);
    return () => window.clearTimeout(t);
  }, []);

  return (
    <div className="w-full flex flex-col items-center gap-4">
      {!ready && !failed && (
        <p className="text-sm" style={{ color: 'var(--muted)' }}>
          Chargement du paiement sécurisé…
        </p>
      )}

      <div className={`w-full flex justify-center ${!ready && !failed ? 'opacity-60' : ''}`}>
        {/* @ts-expect-error Stripe web component */}
        <stripe-buy-button
          buy-button-id={STRIPE_BUY_BUTTON_ID}
          publishable-key={STRIPE_PUBLISHABLE_KEY}
        />
      </div>

      {(failed || ready) && (
        <p className="text-xs text-center" style={{ color: 'var(--muted)' }}>
          {failed ? 'Le bouton ne s’affiche pas ? ' : ''}
          <a
            href={STRIPE_PAYMENT_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold underline underline-offset-2"
            style={{ color: 'var(--accent)' }}
          >
            Ouvrir la page de don Stripe
          </a>
        </p>
      )}
    </div>
  );
}
