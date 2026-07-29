import { Response } from "express";
import { AuthRequest } from "../middleware/authMiddleware";
import Queue from "../models/Queue";
import QueueEntry from "../models/QueueEntry";
import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/asyncHandler";
import { assertOwnsQueueBusiness } from "./queueController";
import { broadcastQueueUpdate, notifyUser } from "../sockets/queueSocket";
import {
  notifyYourTurn,
  notifyGetReady,
} from "../services/notificationService";
import { getIO } from "../index";

const resequencePositions = async (queueId: string) => {
  const activeEntries = await QueueEntry.find({
    queue: queueId,
    status: { $in: ["waiting", "called"] },
  }).sort({ position: 1 });

  await Promise.all(
    activeEntries.map((entry, index) => {
      const newPosition = index + 1;
      if (entry.position !== newPosition) {
        entry.position = newPosition;
        return entry.save();
      }
      return Promise.resolve();
    }),
  );
};

const maybeSendGetReadyNotifications = async (
  queueId: string,
  queueName: string,
) => {
  const secondInLine = await QueueEntry.findOne({
    queue: queueId,
    status: "waiting",
    position: 2,
    user: { $ne: null },
  });

  if (secondInLine?.user) {
    await notifyGetReady(secondInLine.user.toString(), queueName);
  }
};

export const joinQueue = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { id: queueId } = req.params;
    const userId = req.user!.id;

    const queue = await Queue.findById(queueId);
    if (!queue) throw new ApiError(404, "Queue not found.");
    if (queue.status !== "active") {
      throw new ApiError(
        400,
        "This queue is not currently accepting new customers.",
      );
    }

    const existing = await QueueEntry.findOne({
      queue: queueId,
      user: userId,
      status: { $in: ["waiting", "called"] },
    });
    if (existing) {
      throw new ApiError(409, "You already have an active spot in this queue.");
    }

    const activeCount = await QueueEntry.countDocuments({
      queue: queueId,
      status: { $in: ["waiting", "called"] },
    });

    let entry;
    try {
      entry = await QueueEntry.create({
        queue: queueId,
        business: queue.business,
        user: userId,
        position: activeCount + 1,
      });
    } catch (err: any) {
      if (err.code === 11000) {
        throw new ApiError(
          409,
          "You already have an active spot in this queue.",
        );
      }
      throw err;
    }

    const io = getIO();
    await broadcastQueueUpdate(io, queueId);

    res.status(201).json({ success: true, entry });
  },
);

export const leaveQueue = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { id: queueId } = req.params;
    const userId = req.user!.id;

    const entry = await QueueEntry.findOne({
      queue: queueId,
      user: userId,
      status: { $in: ["waiting", "called"] },
    });
    if (!entry)
      throw new ApiError(404, "You do not have an active spot in this queue.");

    entry.status = "cancelled";
    await entry.save();
    await resequencePositions(queueId);

    const io = getIO();
    await broadcastQueueUpdate(io, queueId);

    res
      .status(200)
      .json({ success: true, message: "You have left the queue." });
  },
);

export const addWalkIn = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { id: queueId } = req.params;
    const { name } = req.body;

    const { queue } = await assertOwnsQueueBusiness(
      queueId,
      req.user!.id,
      req.user!.role,
    );

    if (queue.status !== "active") {
      throw new ApiError(400, "This queue is not currently active.");
    }

    const activeCount = await QueueEntry.countDocuments({
      queue: queueId,
      status: { $in: ["waiting", "called"] },
    });

    const entry = await QueueEntry.create({
      queue: queueId,
      business: queue.business,
      isWalkIn: true,
      walkInName: name,
      position: activeCount + 1,
    });

    const io = getIO();
    await broadcastQueueUpdate(io, queueId);

    res.status(201).json({ success: true, entry });
  },
);

export const getQueueEntries = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { id: queueId } = req.params;

    const entries = await QueueEntry.find({
      queue: queueId,
      status: { $in: ["waiting", "called"] },
    })
      .sort({ position: 1 })
      .populate("user", "name phone");

    res.status(200).json({ success: true, entries });
  },
);
export const callNext = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { id: queueId } = req.params;
    const { queue } = await assertOwnsQueueBusiness(
      queueId,
      req.user!.id,
      req.user!.role,
    );

    const currentlyCalled = await QueueEntry.findOne({
      queue: queueId,
      status: "called",
    });
    if (currentlyCalled) {
      currentlyCalled.status = "served";
      currentlyCalled.servedAt = new Date();
      await currentlyCalled.save();
    }

    const nextEntry = await QueueEntry.findOne({
      queue: queueId,
      status: "waiting",
    }).sort({ position: 1 });

    if (!nextEntry) {
      await resequencePositions(queueId);
      const io = getIO();
      await broadcastQueueUpdate(io, queueId);
      return res
        .status(200)
        .json({
          success: true,
          message: "No one is currently waiting.",
          called: null,
        });
    }

    nextEntry.status = "called";
    nextEntry.calledAt = new Date();
    await nextEntry.save();

    await resequencePositions(queueId);

    const io = getIO();

    if (nextEntry.user) {
      const userId = nextEntry.user.toString();
      notifyUser(io, userId, "notification:yourTurn", {
        queueId,
        queueName: queue.name,
      });
      await notifyYourTurn(userId, queue.name);
    }

    await maybeSendGetReadyNotifications(queueId, queue.name);
    await broadcastQueueUpdate(io, queueId);

    res.status(200).json({ success: true, called: nextEntry });
  },
);

export const markNoShow = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const entry = await QueueEntry.findById(req.params.id);
    if (!entry) throw new ApiError(404, "Queue entry not found.");

    await assertOwnsQueueBusiness(
      entry.queue.toString(),
      req.user!.id,
      req.user!.role,
    );

    entry.status = "no-show";
    await entry.save();
    await resequencePositions(entry.queue.toString());

    const io = getIO();
    await broadcastQueueUpdate(io, entry.queue.toString());

    res.status(200).json({ success: true, entry });
  },
);
