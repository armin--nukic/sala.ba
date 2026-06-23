import { Router } from "express";
import { prisma } from "../db.js";
import { adminRoles, requireAuth, requireRole } from "../middleware/auth.js";
import { asyncHandler, ApiError } from "../utils/errors.js";
import { venueSchema } from "../validators.js";
import { routeParam } from "../utils/params.js";

export const venuesRouter = Router();

venuesRouter.get(
  "/",
  asyncHandler(async (req, res) => {
    const q = String(req.query.q ?? "");
    const category = req.query.category ? String(req.query.category) : undefined;
    const city = req.query.city ? String(req.query.city) : undefined;

    const venues = await prisma.venue.findMany({
      where: {
        isActive: req.query.includeInactive === "true" ? undefined : true,
        category: category as never,
        city: city ? { contains: city, mode: "insensitive" } : undefined,
        OR: q
          ? [
              { name: { contains: q, mode: "insensitive" } },
              { description: { contains: q, mode: "insensitive" } },
              { city: { contains: q, mode: "insensitive" } }
            ]
          : undefined
      },
      orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }]
    });

    res.json({ venues });
  })
);

venuesRouter.get(
  "/:slug",
  asyncHandler(async (req, res) => {
    const venue = await prisma.venue.findUnique({ where: { slug: routeParam(req.params.slug, "slug") } });
    if (!venue || !venue.isActive) throw new ApiError(404, "Venue not found");
    res.json({ venue });
  })
);

venuesRouter.post(
  "/",
  requireAuth,
  requireRole(adminRoles),
  asyncHandler(async (req, res) => {
    const data = venueSchema.parse(req.body);
    const venue = await prisma.venue.create({ data });
    res.status(201).json({ venue });
  })
);

venuesRouter.put(
  "/:id",
  requireAuth,
  requireRole(adminRoles),
  asyncHandler(async (req, res) => {
    const data = venueSchema.partial().parse(req.body);
    const venue = await prisma.venue.update({ where: { id: routeParam(req.params.id, "id") }, data });
    res.json({ venue });
  })
);

venuesRouter.delete(
  "/:id",
  requireAuth,
  requireRole(adminRoles),
  asyncHandler(async (req, res) => {
    await prisma.venue.delete({ where: { id: routeParam(req.params.id, "id") } });
    res.status(204).send();
  })
);
