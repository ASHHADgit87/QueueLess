import { Schema, model, Document, Types, Model } from "mongoose";

export interface IReview extends Document {
  business: Types.ObjectId;
  user: Types.ObjectId;
  rating: number;
  comment?: string;
  reply?: string;
  createdAt: Date;
  updatedAt: Date;
}

const reviewSchema = new Schema<IReview>(
  {
    business: {
      type: Schema.Types.ObjectId,
      ref: "Business",
      required: true,
      index: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      default: "",
      maxlength: 500,
    },
    reply: {
      type: String,
      default: "",
      maxlength: 500,
    },
  },
  { timestamps: true },
);

reviewSchema.index({ business: 1, user: 1 }, { unique: true });

const Review: Model<IReview> = model<IReview>("Review", reviewSchema);
export default Review;
