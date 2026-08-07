'use client';

import { useEffect, useRef } from 'react';
import { STRIPE_BUY_BUTTON_ID, STRIPE_PUBLISHABLE_KEY } from '@/lib/donation';

export default function StripeBuyButton() {
  const loaded = useRef(false);

  useEffect(() => {
    if (loaded.current) return;
    loaded.current = true;

    const existing = document.querySelector('script[data-stripe-buy-button]');
    if (!existing) {
      const script = document.createElement('script');
      script.src = 'https://js.stripe.com/v3/buy-button.js';
      script.async = true;
      script.setAttribute('data-stripe-buy-button', 'true');
      document.body.appendChild(script);
    }
  }, []);

  return (
    <div className="w-full flex justify-center">
      {/* @ts-expect-error Stripe web component */}
      <stripe-buy-button
        buy-button-id={STRIPE_BUY_BUTTON_ID}
        publishable-key={STRIPE_PUBLISHABLE_KEY}
      />
    </div>
  );
}
