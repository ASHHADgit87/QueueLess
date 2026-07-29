import { Schema, model, Document, Types, Model } from "mongoose";

export interface IBusiness extends Document {
  owner: Types.ObjectId;
  name: string;
  category: string;
  description?: string;
  address: string;
  location?: {
    lat: number;
    lng: number;
  };
  openingHours: string;
  isVerified: boolean;
  isBanned: boolean;
  avgRating: number;
  ratingCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const businessSchema = new Schema<IBusiness>(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, "Business name is required"],
      trim: true,
      maxlength: 100,
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      trim: true,
    },
    description: {
      type: String,
      default: "",
      maxlength: 500,
    },
    address: {
      type: String,
      required: [true, "Address is required"],
    },
    location: {
      lat: { type: Number },
      lng: { type: Number },
    },
    openingHours: {
      type: String,
      default: "",
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isBanned: {
      type: Boolean,
      default: false,
    },
    avgRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    ratingCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

businessSchema.index({ name: "text", category: "text" });

const Business: Model<IBusiness> = model<IBusiness>("Business", businessSchema);
export default Business;
