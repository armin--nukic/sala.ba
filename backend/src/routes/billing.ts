import { Router } from "express";
import Stripe from "stripe";
import { config } from "../config.js";
import { requireAuth } from "../middleware/auth.js";
import { asyncHandler } from "../utils/errors.js";

export const billingRouter = Router();

billingRouter.post(
  "/checkout",
  requireAuth,
  asyncHandler(async (req, res) => {
    if (!config.stripeSecretKey || !config.stripeProPriceId) {
      res.json({
        mode: "demo",
        message: "Stripe nije konfigurisan. Dodaj STRIPE_SECRET_KEY i STRIPE_PRO_PRICE_ID u .env."
      });
      return;
    }

    const stripe = new Stripe(config.stripeSecretKey);
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price: config.stripeProPriceId, quantity: 1 }],
      customer_email: req.user?.email,
      success_url: config.stripeSuccessUrl ?? `${config.frontendUrl}/dashboard?plan=pro`,
      cancel_url: config.stripeCancelUrl ?? `${config.frontendUrl}/dashboard?plan=cancelled`,
      metadata: {
        userId: req.user!.id,
        plan: "pro"
      }
    });

    res.json({ mode: "stripe", url: session.url });
  })
);
