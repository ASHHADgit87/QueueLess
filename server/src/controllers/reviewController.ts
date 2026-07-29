import { Response } from "express";
import { AuthRequest } from "../middleware/authMiddleware";
import Review from "../models/Review";
import Business from "../models/Business";
import QueueEntry from "../models/QueueEntry";
import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/asyncHandler";

const recalculateBusinessRating = async (businessId: string) => {
  const stats = await Review.aggregate([
    { $match: { business: businessId } },
    {
      $group: { _id: null, avgRating: { $avg: "$rating" }, count: { $sum: 1 } },
    },
  ]);

  await Business.findByIdAndUpdate(businessId, {
    avgRating: stats[0]?.avgRating
      ? Math.round(stats[0].avgRating * 10) / 10
      : 0,
    ratingCount: stats[0]?.count ?? 0,
  });
};

export const createReview = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const businessId = req.params.id as string;
    const { rating, comment } = req.body;
    const userId = req.user!.id;

    const wasServed = await QueueEntry.findOne({
      business: businessId,
      user: userId,
      status: "served",
    });
    if (!wasServed) {
      throw new ApiError(
        403,
        "You can only review a business after being served there.",
      );
    }

    const existing = await Review.findOne({
      business: businessId,
      user: userId,
    });
    if (existing) {
      existing.rating = rating;
      existing.comment = comment;
      await existing.save();
      await recalculateBusinessRating(businessId);
      return res.status(200).json({ success: true, review: existing });
    }

    const review = await Review.create({
      business: businessId,
      user: userId,
      rating,
      comment,
    });
    await recalculateBusinessRating(businessId);

    res.status(201).json({ success: true, review });
  },
);

export const getReviewsForBusiness = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const businessId = req.params.id as string;
    const reviews = await Review.find({ business: businessId })
      .sort({ createdAt: -1 })
      .populate("user", "name");

    res.status(200).json({ success: true, reviews });
  },
);

export const replyToReview = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { reply } = req.body;
    const reviewId = req.params.id as string;
    const review = await Review.findById(reviewId);
    if (!review) throw new ApiError(404, "Review not found.");

    const business = await Business.findById(review.business);
    if (!business) throw new ApiError(404, "Business not found.");

    if (
      business.owner.toString() !== req.user!.id &&
      req.user!.role !== "admin"
    ) {
      throw new ApiError(403, "You do not own this business.");
    }

    review.reply = reply;
    await review.save();

    res.status(200).json({ success: true, review });
  },
);
