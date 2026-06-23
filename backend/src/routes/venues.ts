import { Router } from "express";
import { prisma } from "../db.js";
import { adminRoles, requireAuth, requireRole, venueManagerRoles } from "../middleware/auth.js";
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
    const sport = req.query.sport ? String(req.query.sport) : undefined;
    const maxPrice = req.query.maxPrice ? Number(req.query.maxPrice) : undefined;
    const page = Math.max(Number(req.query.page ?? 1), 1);
    const pageSize = Math.min(Math.max(Number(req.query.pageSize ?? 24), 1), 60);
    const sort = String(req.query.sort ?? "featured");
    const orderBy =
      sort === "price-asc"
        ? [{ priceFrom: "asc" as const }]
        : sort === "price-desc"
          ? [{ priceFrom: "desc" as const }]
          : sort === "name"
            ? [{ name: "asc" as const }]
            : [{ isFeatured: "desc" as const }, { createdAt: "desc" as const }];

    const where = {
      isActive: req.query.includeInactive === "true" ? undefined : true,
      category: category as never,
      city: city ? { contains: city, mode: "insensitive" as const } : undefined,
      priceFrom: Number.isFinite(maxPrice) ? { lte: maxPrice } : undefined,
      sports: sport ? { has: sport } : undefined,
      OR: q
        ? [
            { name: { contains: q, mode: "insensitive" as const } },
            { description: { contains: q, mode: "insensitive" as const } },
            { city: { contains: q, mode: "insensitive" as const } },
            { address: { contains: q, mode: "insensitive" as const } }
          ]
        : undefined
    };

    const [venues, total] = await Promise.all([
      prisma.venue.findMany({
        where,
        orderBy,
        skip: (page - 1) * pageSize,
        take: pageSize
      }),
      prisma.venue.count({ where })
    ]);

    res.json({ venues, meta: { page, pageSize, total, totalPages: Math.ceil(total / pageSize) } });
  })
);

venuesRouter.get(
  "/meta/options",
  asyncHandler(async (_req, res) => {
    const venues = await prisma.venue.findMany({
      where: {
        isActive: true
      },
      select: { city: true, sports: true }
    });
    const cities = [...new Set(venues.map((venue) => venue.city).filter(Boolean))].sort();
    const sports = [...new Set(venues.flatMap((venue) => venue.sports))].sort();
    res.json({ cities, sports });
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
  requireRole(venueManagerRoles),
  asyncHandler(async (req, res) => {
    const data = venueSchema.parse(req.body);
    const isOwner = req.user?.role === "OWNER";
    const venue = await prisma.venue.create({
      data: {
        ...data,
        ownerId: isOwner ? req.user!.id : data.ownerId ?? null,
        isActive: isOwner ? false : data.isActive ?? true,
        isFeatured: isOwner ? false : data.isFeatured ?? false
      }
    });
    res.status(201).json({ venue });
  })
);

venuesRouter.put(
  "/:id",
  requireAuth,
  requireRole(venueManagerRoles),
  asyncHandler(async (req, res) => {
    const id = routeParam(req.params.id, "id");
    const data = venueSchema.partial().parse(req.body);
    const existing = await prisma.venue.findUnique({ where: { id }, select: { ownerId: true } });
    if (!existing) throw new ApiError(404, "Venue not found");

    const isOwner = req.user?.role === "OWNER";
    if (isOwner && existing.ownerId !== req.user!.id) throw new ApiError(403, "You can only edit your venues");
    if (isOwner) {
      delete data.isActive;
      delete data.isFeatured;
      delete data.ownerId;
    }

    const venue = await prisma.venue.update({ where: { id }, data });
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
