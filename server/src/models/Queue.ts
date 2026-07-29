import { Schema, model, Document, Types } from "mongoose";

export interface IQueue extends Document {
  business: Types.ObjectId;
  name: string;
  status: "active" | "paused" | "closed";
  avgServiceTimeMins: number;
}

const queueSchema = new Schema<IQueue>(
  {
    business: { type: Schema.Types.ObjectId, ref: "Business", required: true },
    name: { type: String, required: true },
    status: {
      type: String,
      enum: ["active", "paused", "closed"],
      default: "active",
    },
    avgServiceTimeMins: { type: Number, default: 10 },
  },
  { timestamps: true },
);

export default model<IQueue>("Queue", queueSchema);
