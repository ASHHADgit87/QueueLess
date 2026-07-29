import { Schema, model, Document, Types } from "mongoose";

export interface IQueueEntry extends Document {
  queue: Types.ObjectId;
  user?: Types.ObjectId;
  isWalkIn: boolean;
  walkInName?: string;
  position: number;
  status: "waiting" | "called" | "served" | "cancelled" | "no-show";
  joinedAt: Date;
  calledAt?: Date;
  servedAt?: Date;
}

const queueEntrySchema = new Schema<IQueueEntry>(
  {
    queue: { type: Schema.Types.ObjectId, ref: "Queue", required: true },
    user: { type: Schema.Types.ObjectId, ref: "User" },
    isWalkIn: { type: Boolean, default: false },
    walkInName: { type: String },
    position: { type: Number, required: true },
    status: {
      type: String,
      enum: ["waiting", "called", "served", "cancelled", "no-show"],
      default: "waiting",
    },
    joinedAt: { type: Date, default: Date.now },
    calledAt: { type: Date },
    servedAt: { type: Date },
  },
  { timestamps: true },
);

queueEntrySchema.index({ queue: 1, status: 1, position: 1 });

export default model<IQueueEntry>("QueueEntry", queueEntrySchema);
