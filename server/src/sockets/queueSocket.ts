import { Server, Socket } from "socket.io";
import { Types } from "mongoose";
import QueueEntry from "../models/QueueEntry";

export const registerQueueSocketHandlers = (_io: Server, socket: Socket) => {
  socket.on("queue:subscribe", (queueId: string) => {
    if (!Types.ObjectId.isValid(queueId)) return;
    socket.join(roomForQueue(queueId));
  });

  socket.on("queue:unsubscribe", (queueId: string) => {
    if (!Types.ObjectId.isValid(queueId)) return;
    socket.leave(roomForQueue(queueId));
  });
};

export const roomForQueue = (queueId: string) => `queue:${queueId}`;
export const roomForUser = (userId: string) => `user:${userId}`;

export const broadcastQueueUpdate = async (io: Server, queueId: string) => {
  const entries = await QueueEntry.find({
    queue: queueId,
    status: { $in: ["waiting", "called"] },
  })
    .sort({ position: 1 })
    .populate("user", "name");

  io.to(roomForQueue(queueId)).emit("queue:update", { queueId, entries });
};

export const notifyUser = (
  io: Server,
  userId: string,
  event: "notification:yourTurn" | "notification:getReady",
  payload: Record<string, unknown>,
) => {
  io.to(roomForUser(userId)).emit(event, payload);
};
