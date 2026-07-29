import { Schema, model, Document, Types, Model } from "mongoose";

export type NotificationType =
  | "queue_update"
  | "your_turn"
  | "get_ready"
  | "general";

export interface INotification extends Document {
  user: Types.ObjectId;
  title: string;
  body: string;
  type: NotificationType;
  isRead: boolean;
  createdAt: Date;
}

const notificationSchema = new Schema<INotification>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
    },
    body: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["queue_update", "your_turn", "get_ready", "general"],
      default: "general",
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

notificationSchema.index({ user: 1, isRead: 1, createdAt: -1 });

const Notification: Model<INotification> = model<INotification>(
  "Notification",
  notificationSchema,
);
export default Notification;
