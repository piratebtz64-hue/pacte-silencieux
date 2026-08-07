/** Lien de secours (Payment Link) */
export const DONATION_LINK =
  process.env.NEXT_PUBLIC_STRIPE_DONATION_LINK ||
  process.env.NEXT_PUBLIC_PAYPAL_DONATION_LINK ||
  'https://buy.stripe.com/6oU5kCbAPaEd6tidOd93y02';

export const STRIPE_BUY_BUTTON_ID =
  process.env.NEXT_PUBLIC_STRIPE_BUY_BUTTON_ID ||
  'buy_btn_1U1mHPCv958zyEcwS9EfgXLC';

export const STRIPE_PUBLISHABLE_KEY =
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ||
  'pk_live_51ScksKCv958zyEcwfGY8Ii3W7KXubQiVS63Bvh02RAyUGfP6PfrpygHfo6nGePWpcnygmKWj0dRjQnSdqjw9PqZS000cLImjAx';
