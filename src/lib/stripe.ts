import Stripe from "stripe";

// Server-only Stripe client. The secret key lives in .env.local (STRIPE_SECRET_KEY)
// and must never be imported into a client component. Use a test-mode key
// (sk_test_…) while in the Stripe sandbox.
//
// Built lazily so an unset key fails at request time (with a clear message) rather
// than at module load — otherwise `next build`, which imports route modules to read
// their config, would crash before the key is ever needed.
let client: Stripe | null = null;

export const getStripe = (): Stripe => {
  if (client) return client;
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    throw new Error(
      "STRIPE_SECRET_KEY is not set. Add your Stripe (test mode) secret key to .env.local"
    );
  }
  // No explicit apiVersion — the SDK pins its own, which keeps types in sync with
  // the installed package.
  client = new Stripe(secretKey);
  return client;
};
