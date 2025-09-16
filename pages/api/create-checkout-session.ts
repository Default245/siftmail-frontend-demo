import type { NextApiRequest, NextApiResponse } from "next";
import { getStripeOrNull } from "@/lib/stripe";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (process.env.USE_FAKE_STRIPE === "1") {
    return res.status(200).json({ url: "/mock-checkout?session=cs_test_mock_123" });
  }

  const stripe = getStripeOrNull();
  if (!stripe) {
    return res.status(503).json({ error: "STRIPE_NOT_CONFIGURED" });
  }

  // real Stripe code would go here later
}
