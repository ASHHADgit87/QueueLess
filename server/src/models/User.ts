import { Schema, model, Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: "customer" | "business" | "admin";
  phone?: string;
  pushToken?: string;
  createdAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["customer", "business", "admin"],
      default: "customer",
    },
    phone: { type: String },
    pushToken: { type: String },
  },
  { timestamps: true },
);

export default model<IUser>("User", userSchema);
