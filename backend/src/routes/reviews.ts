import { Router } from "express";
import { prisma } from "../db.js";
import { asyncHandler } from "../utils/errors.js";
import { reviewSchema } from "../validators.js";

export const reviewsRouter = Router();

reviewsRouter.get(
  "/venue/:venueId",
  asyncHandler(async (req, res) => {
    const reviews = await prisma.review.findMany({
      where: { venueId: String(req.params.venueId) },
      orderBy: { createdAt: "desc" }
    });
    res.json({ reviews });
  })
);

reviewsRouter.post(
  "/",
  asyncHandler(async (req, res) => {
    const data = reviewSchema.parse(req.body);
    const review = await prisma.review.create({
      data: { ...data, userId: req.user?.id }
    });
    res.status(201).json({ review });
  })
);
