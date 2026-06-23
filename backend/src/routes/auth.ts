import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt, { type SignOptions } from "jsonwebtoken";
import { prisma } from "../db.js";
import { config } from "../config.js";
import { asyncHandler, ApiError } from "../utils/errors.js";
import { loginSchema, registerSchema } from "../validators.js";
import { requireAuth } from "../middleware/auth.js";

export const authRouter = Router();

function publicUser(user: { id: string; name: string; email: string; role: string; phone: string | null; isActive?: boolean }) {
  return user;
}

function signToken(user: { id: string; email: string; role: string }) {
  return jwt.sign({ id: user.id, email: user.email, role: user.role }, config.jwtSecret, {
    expiresIn: config.jwtExpiresIn as SignOptions["expiresIn"]
  });
}

authRouter.post(
  "/register",
  asyncHandler(async (req, res) => {
    const data = registerSchema.parse(req.body);
    const existing = await prisma.user.findUnique({ where: { email: data.email } });
    if (existing) throw new ApiError(409, "Email already registered");

    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email.toLowerCase(),
        phone: data.phone,
        passwordHash: await bcrypt.hash(data.password, 12)
      },
      select: { id: true, name: true, email: true, role: true, phone: true }
    });

    const token = signToken(user);
    res.cookie("token", token, { httpOnly: true, sameSite: "lax" });
    res.status(201).json({ token, user: publicUser(user) });
  })
);

authRouter.post(
  "/login",
  asyncHandler(async (req, res) => {
    const data = loginSchema.parse(req.body);
    const user = await prisma.user.findUnique({ where: { email: data.email.toLowerCase() } });
    if (!user || !user.isActive || !(await bcrypt.compare(data.password, user.passwordHash))) {
      throw new ApiError(401, "Invalid credentials");
    }

    const token = signToken(user);
    res.cookie("token", token, { httpOnly: true, sameSite: "lax" });
    res.json({
      token,
      user: publicUser({ id: user.id, name: user.name, email: user.email, role: user.role, phone: user.phone, isActive: user.isActive })
    });
  })
);

authRouter.get(
  "/me",
  requireAuth,
  asyncHandler(async (req, res) => {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      select: { id: true, name: true, email: true, role: true, phone: true, isActive: true }
    });
    if (!user) throw new ApiError(404, "User not found");
    res.json({ user });
  })
);

authRouter.post("/logout", (_req, res) => {
  res.clearCookie("token");
  res.json({ message: "Logged out" });
});
