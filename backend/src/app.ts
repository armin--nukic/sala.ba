import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import path from "node:path";
import { config } from "./config.js";
import { authRouter } from "./routes/auth.js";
import { venuesRouter } from "./routes/venues.js";
import { contactRouter } from "./routes/contact.js";
import { inquiriesRouter } from "./routes/inquiries.js";
import { adminRouter } from "./routes/admin.js";
import { reviewsRouter } from "./routes/reviews.js";
import { forumRouter } from "./routes/forum.js";
import { billingRouter } from "./routes/billing.js";
import { uploadsRoot, uploadsRouter } from "./routes/uploads.js";
import { errorHandler } from "./utils/errors.js";

export const app = express();

app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
app.use(
  cors({
    origin(origin, callback) {
      if (!origin) {
        callback(null, true);
        return;
      }

      try {
        const { hostname } = new URL(origin);
        const isLocal = ["localhost", "127.0.0.1", "::1"].includes(hostname);
        callback(null, isLocal || config.allowedOrigins.includes(origin));
      } catch {
        callback(null, false);
      }
    },
    credentials: true
  })
);
app.use(express.json({ limit: "1mb" }));
app.use("/uploads", express.static(path.join(uploadsRoot)));
app.use(cookieParser());
app.use(morgan("dev"));
app.use(rateLimit({ windowMs: 60_000, limit: 180 }));

app.get("/health", (_req, res) => {
  res.json({ status: "ok", service: "sala-backend" });
});

app.use("/api/auth", authRouter);
app.use("/api/venues", venuesRouter);
app.use("/api/contact", contactRouter);
app.use("/api/inquiries", inquiriesRouter);
app.use("/api/admin", adminRouter);
app.use("/api/reviews", reviewsRouter);
app.use("/api/forum", forumRouter);
app.use("/api/billing", billingRouter);
app.use("/api/uploads", uploadsRouter);
app.use(errorHandler);
