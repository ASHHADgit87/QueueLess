import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/ApiError";
import { env } from "../config/env";
import User from "../models/User";

export interface AuthRequest extends Request {
  user?: {
    id: string;
    role: "customer" | "business" | "admin";
  };
}

interface DecodedToken {
  id: string;
  role: "customer" | "business" | "admin";
  iat: number;
  exp: number;
}

export const protect = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new ApiError(401, "Not authenticated. Please log in.");
    }

    const token = authHeader.split(" ")[1];

    let decoded: DecodedToken;
    try {
      decoded = jwt.verify(token, env.JWT_SECRET) as DecodedToken;
    } catch {
      throw new ApiError(401, "Invalid or expired token. Please log in again.");
    }

    const user = await User.findById(decoded.id).select("_id role isBanned");
    if (!user) {
      throw new ApiError(401, "User belonging to this token no longer exists.");
    }
    if (user.isBanned) {
      throw new ApiError(403, "This account has been suspended.");
    }

    req.user = { id: user._id.toString(), role: user.role };
    next();
  } catch (err) {
    next(err);
  }
};

export const optionalAuth = async (
  req: AuthRequest,
  _res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) return next();

  try {
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, env.JWT_SECRET) as DecodedToken;
    req.user = { id: decoded.id, role: decoded.role };
  } catch {}
  next();
};
