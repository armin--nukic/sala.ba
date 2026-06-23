import "dotenv/config";

export const config = {
  port: Number(process.env.PORT ?? 4000),
  jwtSecret: process.env.JWT_SECRET ?? "dev-only-change-me",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? "7d",
  frontendUrl: process.env.FRONTEND_URL ?? "http://localhost:3111",
  allowedOrigins: (process.env.FRONTEND_URLS ?? process.env.FRONTEND_URL ?? "http://localhost:3111")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean),
  stripeSecretKey: process.env.STRIPE_SECRET_KEY,
  stripeProPriceId: process.env.STRIPE_PRO_PRICE_ID,
  stripeSuccessUrl: process.env.STRIPE_SUCCESS_URL,
  stripeCancelUrl: process.env.STRIPE_CANCEL_URL
};
