/** Lien de don public (Stripe Payment Link) */
export const DONATION_LINK =
  process.env.NEXT_PUBLIC_STRIPE_DONATION_LINK ||
  process.env.NEXT_PUBLIC_PAYPAL_DONATION_LINK ||
  'https://buy.stripe.com/6oU5kCbAPaEd6tidOd93y02';
