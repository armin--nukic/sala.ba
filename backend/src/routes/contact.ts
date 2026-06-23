import { Router } from "express";
import { prisma } from "../db.js";
import { asyncHandler } from "../utils/errors.js";
import { contactSchema } from "../validators.js";

export const contactRouter = Router();

contactRouter.post(
  "/",
  asyncHandler(async (req, res) => {
    const data = contactSchema.parse(req.body);
    const message = await prisma.contactMessage.create({ data });
    res.status(201).json({ message });
  })
);
