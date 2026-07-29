import { Schema, model, Document, Types, Model } from "mongoose";

export type QueueEntryStatus =
  | "waiting"
  | "called"
  | "served"
  | "cancelled"
  | "no-show";

export interface IQueueEntry extends Document {
  queue: Types.ObjectId;
  business: Types.ObjectId;
  user?: Types.ObjectId;
  isWalkIn: boolean;
  walkInName?: string;
  position: number;
  status: QueueEntryStatus;
  joinedAt: Date;
  calledAt?: Date;
  servedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const queueEntrySchema = new Schema<IQueueEntry>(
  {
    queue: {
      type: Schema.Types.ObjectId,
      ref: "Queue",
      required: true,
    },
    business: {
      type: Schema.Types.ObjectId,
      ref: "Business",
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    isWalkIn: {
      type: Boolean,
      default: false,
    },
    walkInName: {
      type: String,
      default: "",
    },
    position: {
      type: Number,
      required: true,
      min: 1,
    },
    status: {
      type: String,
      enum: ["waiting", "called", "served", "cancelled", "no-show"],
      default: "waiting",
      index: true,
    },
    joinedAt: {
      type: Date,
      default: Date.now,
    },
    calledAt: {
      type: Date,
    },
    servedAt: {
      type: Date,
    },
  },
  { timestamps: true },
);

queueEntrySchema.index({ queue: 1, status: 1, position: 1 });
queueEntrySchema.index(
  { queue: 1, user: 1, status: 1 },
  { partialFilterExpression: { status: { $in: ["waiting", "called"] } } },
);

const QueueEntry: Model<IQueueEntry> = model<IQueueEntry>(
  "QueueEntry",
  queueEntrySchema,
);
export default QueueEntry;
