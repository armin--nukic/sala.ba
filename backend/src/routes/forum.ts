import { Router } from "express";
import { prisma } from "../db.js";
import { asyncHandler } from "../utils/errors.js";
import { forumPostSchema } from "../validators.js";

export const forumRouter = Router();

forumRouter.get(
  "/",
  asyncHandler(async (_req, res) => {
    const posts = await prisma.forumPost.findMany({
      include: { user: { select: { id: true, name: true, email: true } } },
      orderBy: { createdAt: "desc" },
      take: 30
    });
    res.json({ posts });
  })
);

forumRouter.post(
  "/",
  asyncHandler(async (req, res) => {
    const data = forumPostSchema.parse(req.body);
    const post = await prisma.forumPost.create({
      data: { ...data, userId: req.user?.id }
    });
    res.status(201).json({ post });
  })
);
