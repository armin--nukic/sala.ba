import { Router } from "express";
import bcrypt from "bcryptjs";
import { prisma } from "../db.js";
import { adminRoles, requireAuth, requireRole } from "../middleware/auth.js";
import { ApiError, asyncHandler } from "../utils/errors.js";
import { adminCreateUserSchema, bookingStatusSchema, roleSchema } from "../validators.js";
import { routeParam } from "../utils/params.js";

export const adminRouter = Router();

adminRouter.use(requireAuth, requireRole(adminRoles));

adminRouter.get(
  "/stats",
  asyncHandler(async (_req, res) => {
    const [users, venues, contactMessages, inquiries] = await Promise.all([
      prisma.user.count(),
      prisma.venue.count(),
      prisma.contactMessage.count(),
      prisma.inquiry.count()
    ]);
    res.json({ stats: { users, venues, contactMessages, inquiries } });
  })
);

adminRouter.get(
  "/users",
  asyncHandler(async (_req, res) => {
    const users = await prisma.user.findMany({
      select: { id: true, name: true, email: true, role: true, phone: true, createdAt: true },
      orderBy: { createdAt: "desc" }
    });
    res.json({ users });
  })
);

adminRouter.post(
  "/users",
  asyncHandler(async (req, res) => {
    const data = adminCreateUserSchema.parse(req.body);
    const canManageAdmins = req.user?.role === "SUPER_ADMIN";
    if (!canManageAdmins && (data.role === "ADMIN" || data.role === "SUPER_ADMIN")) {
      throw new ApiError(403, "Only SUPER_ADMIN can create admin users");
    }

    const existing = await prisma.user.findUnique({ where: { email: data.email.toLowerCase() } });
    if (existing) throw new ApiError(409, "Email already registered");

    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email.toLowerCase(),
        phone: data.phone,
        role: data.role,
        passwordHash: await bcrypt.hash(data.password, 12)
      },
      select: { id: true, name: true, email: true, role: true, phone: true, createdAt: true }
    });

    res.status(201).json({ user });
  })
);

adminRouter.put(
  "/users/:id/role",
  asyncHandler(async (req, res) => {
    const { role } = roleSchema.parse(req.body);
    const canManageAdmins = req.user?.role === "SUPER_ADMIN";
    if (!canManageAdmins && (role === "ADMIN" || role === "SUPER_ADMIN")) {
      throw new ApiError(403, "Only SUPER_ADMIN can assign admin roles");
    }

    const user = await prisma.user.update({
      where: { id: routeParam(req.params.id, "id") },
      data: { role },
      select: { id: true, name: true, email: true, role: true }
    });
    res.json({ user });
  })
);

adminRouter.get(
  "/contact-messages",
  asyncHandler(async (_req, res) => {
    const messages = await prisma.contactMessage.findMany({ orderBy: { createdAt: "desc" } });
    res.json({ messages });
  })
);

adminRouter.get(
  "/inquiries",
  asyncHandler(async (_req, res) => {
    const inquiries = await prisma.inquiry.findMany({
      include: { venue: true, user: { select: { id: true, name: true, email: true } } },
      orderBy: { createdAt: "desc" }
    });
    res.json({ inquiries });
  })
);

adminRouter.put(
  "/inquiries/:id/status",
  asyncHandler(async (req, res) => {
    const { status } = bookingStatusSchema.parse(req.body);
    const inquiry = await prisma.inquiry.update({
      where: { id: routeParam(req.params.id, "id") },
      data: { status },
      include: { venue: true }
    });
    res.json({ inquiry });
  })
);
