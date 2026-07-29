import mongoose from "mongoose";
import { env } from "./env";
export const connectDB = async (): Promise<void> => {
  try {
    mongoose.set("strictQuery", true);

    const conn = await mongoose.connect(env.MONGO_URI);

    console.log(`[DB] MongoDB connected: ${conn.connection.host}`);

    mongoose.connection.on("error", (err) => {
      console.error("[DB] MongoDB connection error:", err);
    });

    mongoose.connection.on("disconnected", () => {
      console.warn(
        "[DB] MongoDB disconnected. Attempting to reconnect is handled by the driver.",
      );
    });
  } catch (err) {
    console.error("[DB] Failed to connect to MongoDB:", err);
    process.exit(1);
  }
};
