import type StripeType from "stripe";

export function getStripeOrNull() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;

  const Stripe = require("stripe") as typeof StripeType;
  return new Stripe(key, { apiVersion: "2024-06-20" });
}