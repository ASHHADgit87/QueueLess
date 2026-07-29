import { Response } from "express";
import { AuthRequest } from "../middleware/authMiddleware";
import Business from "../models/Business";
import User from "../models/User";
import Review from "../models/Review";
import QueueEntry from "../models/QueueEntry";
import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/asyncHandler";

export const listAllBusinesses = asyncHandler(
  async (_req: AuthRequest, res: Response) => {
    const businesses = await Business.find()
      .sort({ createdAt: -1 })
      .populate("owner", "name email");
    res.status(200).json({ success: true, businesses });
  },
);
export const verifyBusiness = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const business = await Business.findByIdAndUpdate(
      req.params.id,
      { isVerified: true },
      { new: true },
    );
    if (!business) throw new ApiError(404, "Business not found.");
    res.status(200).json({ success: true, business });
  },
);

export const banBusiness = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const business = await Business.findByIdAndUpdate(
      req.params.id,
      { isBanned: true },
      { new: true },
    );
    if (!business) throw new ApiError(404, "Business not found.");
    res.status(200).json({ success: true, business });
  },
);

export const listAllUsers = asyncHandler(
  async (_req: AuthRequest, res: Response) => {
    const users = await User.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, users });
  },
);

export const banUser = asyncHandler(async (req: AuthRequest, res: Response) => {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { isBanned: true },
    { new: true },
  );
  if (!user) throw new ApiError(404, "User not found.");
  res.status(200).json({ success: true, user });
});

export const deleteReview = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const review = await Review.findByIdAndDelete(req.params.id);
    if (!review) throw new ApiError(404, "Review not found.");
    res.status(200).json({ success: true, message: "Review deleted." });
  },
);

export const getPlatformStats = asyncHandler(
  async (_req: AuthRequest, res: Response) => {
    const [totalUsers, totalBusinesses, totalServed] = await Promise.all([
      User.countDocuments(),
      Business.countDocuments(),
      QueueEntry.countDocuments({ status: "served" }),
    ]);

    res
      .status(200)
      .json({
        success: true,
        stats: { totalUsers, totalBusinesses, totalServed },
      });
  },
);
