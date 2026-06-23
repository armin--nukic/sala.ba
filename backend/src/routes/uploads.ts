import fs from "node:fs";
import path from "node:path";
import { Router } from "express";
import multer from "multer";
import { config } from "../config.js";
import { requireAuth, requireRole, venueManagerRoles } from "../middleware/auth.js";
import { ApiError, asyncHandler } from "../utils/errors.js";

export const uploadsRouter = Router();

export const uploadsRoot = path.join(process.cwd(), "uploads");
const venueUploadsDir = path.join(uploadsRoot, "venues");

fs.mkdirSync(venueUploadsDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, callback) => callback(null, venueUploadsDir),
  filename: (_req, file, callback) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const safeBase = path
      .basename(file.originalname, ext)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 48);
    callback(null, `${Date.now()}-${safeBase || "venue"}${ext}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024, files: 8 },
  fileFilter: (_req, file, callback) => {
    if (!file.mimetype.startsWith("image/")) {
      callback(new ApiError(400, "Only image uploads are allowed"));
      return;
    }
    callback(null, true);
  }
});

uploadsRouter.post(
  "/venues",
  requireAuth,
  requireRole(venueManagerRoles),
  upload.array("images", 8),
  asyncHandler(async (req, res) => {
    const files = (req.files ?? []) as Express.Multer.File[];
    if (!files.length) throw new ApiError(400, "At least one image is required");

    const images = files.map((file) => ({
      filename: file.filename,
      url: `${config.backendPublicUrl}/uploads/venues/${file.filename}`
    }));

    res.status(201).json({ images });
  })
);
