import { Schema, model, Document, Types, Model } from "mongoose";

export type QueueStatus = "active" | "paused" | "closed";

export interface IQueue extends Document {
  business: Types.ObjectId;
  name: string;
  status: QueueStatus;
  avgServiceTimeMins: number;
  createdAt: Date;
  updatedAt: Date;
}

const queueSchema = new Schema<IQueue>(
  {
    business: {
      type: Schema.Types.ObjectId,
      ref: "Business",
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, "Queue name is required"],
      trim: true,
      maxlength: 60,
    },
    status: {
      type: String,
      enum: ["active", "paused", "closed"],
      default: "active",
    },
    avgServiceTimeMins: {
      type: Number,
      default: 10,
      min: 1,
    },
  },
  { timestamps: true },
);

queueSchema.index({ business: 1, status: 1 });

const Queue: Model<IQueue> = model<IQueue>("Queue", queueSchema);
export default Queue;
