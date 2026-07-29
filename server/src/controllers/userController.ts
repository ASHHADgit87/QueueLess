import { Response } from "express";
import { AuthRequest } from "../middleware/authMiddleware";
import User from "../models/User";
import QueueEntry from "../models/QueueEntry";
import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/asyncHandler";

export const getMe = asyncHandler(async (req: AuthRequest, res: Response) => {
  const user = await User.findById(req.user!.id);
  if (!user) throw new ApiError(404, "User not found.");

  res.status(200).json({ success: true, user });
});

export const updateMe = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { name, phone, pushToken } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user!.id,
      {
        $set: {
          ...(name && { name }),
          ...(phone && { phone }),
          ...(pushToken && { pushToken }),
        },
      },
      { new: true, runValidators: true },
    );

    if (!user) throw new ApiError(404, "User not found.");

    res.status(200).json({ success: true, user });
  },
);

export const getMyHistory = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const history = await QueueEntry.find({
      user: req.user!.id,
      status: { $in: ["served", "cancelled", "no-show"] },
    })
      .sort({ createdAt: -1 })
      .limit(50)
      .populate("queue", "name")
      .populate("business", "name category");

    res.status(200).json({ success: true, history });
  },
);
