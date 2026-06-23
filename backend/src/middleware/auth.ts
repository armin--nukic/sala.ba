import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import type { Role } from "@prisma/client";
import { config } from "../config.js";
import { ApiError } from "../utils/errors.js";
import type { JwtUser } from "../types.js";

function getToken(req: Request) {
  const authHeader = req.headers.authorization;
  if (authHeader?.startsWith("Bearer ")) return authHeader.slice(7);
  return req.cookies?.token as string | undefined;
}

export function requireAuth(req: Request, _res: Response, next: NextFunction) {
  const token = getToken(req);
  if (!token) throw new ApiError(401, "Authentication required");

  try {
    req.user = jwt.verify(token, config.jwtSecret) as JwtUser;
    next();
  } catch {
    throw new ApiError(401, "Invalid or expired token");
  }
}

export function requireRole(roles: Role[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) throw new ApiError(401, "Authentication required");
    if (!roles.includes(req.user.role)) throw new ApiError(403, "Insufficient permissions");
    next();
  };
}

export const adminRoles: Role[] = ["ADMIN", "SUPER_ADMIN"];
