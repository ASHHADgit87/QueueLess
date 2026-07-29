import { Response } from "express";
import { AuthRequest } from "../middleware/authMiddleware";
import Business from "../models/Business";
import Queue from "../models/Queue";
import QueueEntry from "../models/QueueEntry";
import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/asyncHandler";
import { getBusinessAnalytics } from "../services/analyticsService";

export const listBusinesses = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { search, category } = req.query as {
      search?: string;
      category?: string;
    };

    const filter: Record<string, unknown> = { isBanned: false };

    if (search) {
      filter.$text = { $search: search };
    }
    if (category) {
      filter.category = category;
    }

    const businesses = await Business.find(filter)
      .sort({ avgRating: -1 })
      .limit(50);

    res
      .status(200)
      .json({ success: true, count: businesses.length, businesses });
  },
);

export const getBusinessById = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const business = await Business.findById(req.params.id);
    if (!business || business.isBanned) {
      throw new ApiError(404, "Business not found.");
    }

    const queues = await Queue.find({
      business: business._id,
      status: { $ne: "closed" },
    });

    const queuesWithCounts = await Promise.all(
      queues.map(async (queue) => {
        const waitingCount = await QueueEntry.countDocuments({
          queue: queue._id,
          status: { $in: ["waiting", "called"] },
        });
        return { ...queue.toObject(), waitingCount };
      }),
    );

    res.status(200).json({ success: true, business, queues: queuesWithCounts });
  },
);

export const createBusiness = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { name, category, description, address, openingHours, location } =
      req.body;

    const business = await Business.create({
      owner: req.user!.id,
      name,
      category,
      description,
      address,
      openingHours,
      location,
    });

    res.status(201).json({ success: true, business });
  },
);

export const getMyBusinesses = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const businesses = await Business.find({ owner: req.user!.id }).sort({
      createdAt: -1,
    });
    res.status(200).json({ success: true, businesses });
  },
);

export const updateBusiness = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const business = await Business.findById(req.params.id);
    if (!business) throw new ApiError(404, "Business not found.");

    if (
      business.owner.toString() !== req.user!.id &&
      req.user!.role !== "admin"
    ) {
      throw new ApiError(403, "You do not own this business.");
    }

    Object.assign(business, req.body);
    await business.save();

    res.status(200).json({ success: true, business });
  },
);

export const deleteBusiness = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const business = await Business.findById(req.params.id);
    if (!business) throw new ApiError(404, "Business not found.");

    if (
      business.owner.toString() !== req.user!.id &&
      req.user!.role !== "admin"
    ) {
      throw new ApiError(403, "You do not own this business.");
    }

    await business.deleteOne();
    res.status(200).json({ success: true, message: "Business deleted." });
  },
);

export const getBusinessAnalyticsController = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const business = await Business.findById(req.params.id);
    if (!business) throw new ApiError(404, "Business not found.");

    if (
      business.owner.toString() !== req.user!.id &&
      req.user!.role !== "admin"
    ) {
      throw new ApiError(403, "You do not own this business.");
    }

    const analytics = await getBusinessAnalytics(business._id.toString());
    res.status(200).json({ success: true, analytics });
  },
);
