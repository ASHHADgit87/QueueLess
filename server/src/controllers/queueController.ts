import { Response } from "express";
import { AuthRequest } from "../middleware/authMiddleware";
import Business from "../models/Business";
import Queue from "../models/Queue";
import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/asyncHandler";

const assertOwnsQueueBusiness = async (
  queueId: string,
  userId: string,
  role: string,
) => {
  const queue = await Queue.findById(queueId);
  if (!queue) throw new ApiError(404, "Queue not found.");

  const business = await Business.findById(queue.business);
  if (!business) throw new ApiError(404, "Parent business not found.");

  if (business.owner.toString() !== userId && role !== "admin") {
    throw new ApiError(403, "You do not manage this queue.");
  }

  return { queue, business };
};

export const createQueue = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { businessId } = req.params;
    const { name, avgServiceTimeMins } = req.body;

    const business = await Business.findById(businessId);
    if (!business) throw new ApiError(404, "Business not found.");

    if (
      business.owner.toString() !== req.user!.id &&
      req.user!.role !== "admin"
    ) {
      throw new ApiError(403, "You do not own this business.");
    }

    const queue = await Queue.create({
      business: business._id,
      name,
      avgServiceTimeMins,
    });

    res.status(201).json({ success: true, queue });
  },
);

export const getQueuesForBusiness = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { businessId } = req.params;
    const queues = await Queue.find({ business: businessId }).sort({
      createdAt: 1,
    });
    res.status(200).json({ success: true, queues });
  },
);

export const updateQueue = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { queue } = await assertOwnsQueueBusiness(
      req.params.id,
      req.user!.id,
      req.user!.role,
    );

    Object.assign(queue, req.body);
    await queue.save();

    res.status(200).json({ success: true, queue });
  },
);

export const deleteQueue = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { queue } = await assertOwnsQueueBusiness(
      req.params.id,
      req.user!.id,
      req.user!.role,
    );
    await queue.deleteOne();
    res.status(200).json({ success: true, message: "Queue deleted." });
  },
);

export { assertOwnsQueueBusiness };
