import { Response } from "express";
import { AuthRequest } from "../middleware/authMiddleware";
import User from "../models/User";
import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/asyncHandler";
import { generateToken } from "../utils/generateToken";

export const register = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { name, email, password, role, phone } = req.body;

    const existing = await User.findOne({ email });
    if (existing) {
      throw new ApiError(409, "An account with this email already exists.");
    }

    const safeRole = role === "business" ? "business" : "customer";

    const user = await User.create({
      name,
      email,
      password,
      role: safeRole,
      phone,
    });

    const token = generateToken({ id: user._id.toString(), role: user.role });

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
      },
    });
  },
);

export const login = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    throw new ApiError(401, "Invalid email or password.");
  }

  if (user.isBanned) {
    throw new ApiError(
      403,
      "This account has been suspended. Contact support.",
    );
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new ApiError(401, "Invalid email or password.");
  }

  const token = generateToken({ id: user._id.toString(), role: user.role });

  res.status(200).json({
    success: true,
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
    },
  });
});

export const logout = asyncHandler(async (_req: AuthRequest, res: Response) => {
  res.status(200).json({ success: true, message: "Logged out successfully." });
});
