import { Router } from "express";
import { prisma } from "../db.js";
import { requireAuth } from "../middleware/auth.js";
import { asyncHandler } from "../utils/errors.js";
import { inquirySchema } from "../validators.js";

export const inquiriesRouter = Router();

inquiriesRouter.post(
  "/",
  requireAuth,
  asyncHandler(async (req, res) => {
    const data = inquirySchema.parse(req.body);
    const inquiry = await prisma.inquiry.create({
      data: {
        ...data,
        eventDate: data.eventDate ? new Date(data.eventDate) : undefined,
        userId: req.user?.id
      }
    });
    res.status(201).json({ inquiry });
  })
);
