import { Router } from "express";
import bcrypt from "bcryptjs";
import { prisma } from "../db.js";
import { adminRoles, requireAuth, requireRole, venueManagerRoles } from "../middleware/auth.js";
import { ApiError, asyncHandler } from "../utils/errors.js";
import { adminCreateUserSchema, bookingStatusSchema, roleSchema, userStatusSchema } from "../validators.js";
import { routeParam } from "../utils/params.js";

export const adminRouter = Router();

adminRouter.use(requireAuth);

adminRouter.get(
  "/stats",
  requireRole(venueManagerRoles),
  asyncHandler(async (req, res) => {
    const ownerVenueWhere = req.user?.role === "OWNER" ? { ownerId: req.user.id } : {};
    const inquiryWhere = req.user?.role === "OWNER" ? { venue: { ownerId: req.user.id } } : {};
    const [users, venues, contactMessages, inquiries] = await Promise.all([
      req.user?.role === "SUPER_ADMIN" ? prisma.user.count() : Promise.resolve(0),
      prisma.venue.count({ where: ownerVenueWhere }),
      req.user?.role === "OWNER" ? Promise.resolve(0) : prisma.contactMessage.count(),
      prisma.inquiry.count({ where: inquiryWhere })
    ]);
    res.json({ stats: { users, venues, contactMessages, inquiries } });
  })
);

adminRouter.get(
  "/users",
  requireRole(["SUPER_ADMIN"]),
  asyncHandler(async (_req, res) => {
    const users = await prisma.user.findMany({
      select: { id: true, name: true, email: true, role: true, phone: true, isActive: true, createdAt: true },
      orderBy: { createdAt: "desc" }
    });
    res.json({ users });
  })
);

adminRouter.post(
  "/users",
  requireRole(["SUPER_ADMIN"]),
  asyncHandler(async (req, res) => {
    const data = adminCreateUserSchema.parse(req.body);

    const existing = await prisma.user.findUnique({ where: { email: data.email.toLowerCase() } });
    if (existing) throw new ApiError(409, "Email already registered");

    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email.toLowerCase(),
        phone: data.phone,
        role: data.role,
        isActive: true,
        passwordHash: await bcrypt.hash(data.password, 12)
      },
      select: { id: true, name: true, email: true, role: true, phone: true, isActive: true, createdAt: true }
    });

    res.status(201).json({ user });
  })
);

adminRouter.put(
  "/users/:id/role",
  requireRole(["SUPER_ADMIN"]),
  asyncHandler(async (req, res) => {
    const { role } = roleSchema.parse(req.body);
    const id = routeParam(req.params.id, "id");
    const target = await prisma.user.findUnique({ where: { id }, select: { role: true } });
    if (!target) throw new ApiError(404, "User not found");
    if (target.role === "SUPER_ADMIN") throw new ApiError(403, "SUPER_ADMIN users cannot be changed");

    const user = await prisma.user.update({
      where: { id },
      data: { role },
      select: { id: true, name: true, email: true, role: true, isActive: true }
    });
    res.json({ user });
  })
);

adminRouter.put(
  "/users/:id/status",
  requireRole(["SUPER_ADMIN"]),
  asyncHandler(async (req, res) => {
    const { isActive } = userStatusSchema.parse(req.body);
    const id = routeParam(req.params.id, "id");
    const target = await prisma.user.findUnique({ where: { id }, select: { role: true } });
    if (!target) throw new ApiError(404, "User not found");
    if (target.role === "SUPER_ADMIN") throw new ApiError(403, "SUPER_ADMIN users cannot be deactivated");

    const user = await prisma.user.update({
      where: { id },
      data: { isActive },
      select: { id: true, name: true, email: true, role: true, isActive: true }
    });
    res.json({ user });
  })
);

adminRouter.get(
  "/venues",
  requireRole(venueManagerRoles),
  asyncHandler(async (req, res) => {
    const venues = await prisma.venue.findMany({
      where: req.user?.role === "OWNER" ? { ownerId: req.user.id } : undefined,
      include: { owner: { select: { id: true, name: true, email: true } } },
      orderBy: [{ isActive: "desc" }, { createdAt: "desc" }]
    });
    res.json({ venues });
  })
);

adminRouter.get(
  "/contact-messages",
  requireRole(adminRoles),
  asyncHandler(async (_req, res) => {
    const messages = await prisma.contactMessage.findMany({ orderBy: { createdAt: "desc" } });
    res.json({ messages });
  })
);

adminRouter.get(
  "/inquiries",
  requireRole(venueManagerRoles),
  asyncHandler(async (req, res) => {
    const inquiries = await prisma.inquiry.findMany({
      where: req.user?.role === "OWNER" ? { venue: { ownerId: req.user.id } } : undefined,
      include: { venue: true, user: { select: { id: true, name: true, email: true } } },
      orderBy: { createdAt: "desc" }
    });
    res.json({ inquiries });
  })
);

adminRouter.put(
  "/inquiries/:id/status",
  requireRole(venueManagerRoles),
  asyncHandler(async (req, res) => {
    const { status } = bookingStatusSchema.parse(req.body);
    const id = routeParam(req.params.id, "id");
    if (req.user?.role === "OWNER") {
      const inquiry = await prisma.inquiry.findUnique({ where: { id }, select: { venue: { select: { ownerId: true } } } });
      if (!inquiry || inquiry.venue.ownerId !== req.user.id) throw new ApiError(403, "You can only update inquiries for your venues");
    }
    const inquiry = await prisma.inquiry.update({
      where: { id },
      data: { status },
      include: { venue: true }
    });
    res.json({ inquiry });
  })
);
