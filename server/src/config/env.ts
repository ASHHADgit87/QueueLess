import dotenv from "dotenv";

dotenv.config();
interface Env {
  PORT: number;
  NODE_ENV: "development" | "production" | "test";
  MONGO_URI: string;
  JWT_SECRET: string;
  JWT_EXPIRES_IN: string;
  CLIENT_ORIGIN: string;
  RATE_LIMIT_WINDOW_MS: number;
  RATE_LIMIT_MAX: number;
}

const required = ["MONGO_URI", "JWT_SECRET"] as const;

for (const key of required) {
  if (!process.env[key]) {
    throw new Error(
      `Missing required environment variable: ${key}. Check your .env file.`,
    );
  }
}

export const env: Env = {
  PORT: Number(process.env.PORT) || 5000,
  NODE_ENV: (process.env.NODE_ENV as Env["NODE_ENV"]) || "development",
  MONGO_URI: process.env.MONGO_URI as string,
  JWT_SECRET: process.env.JWT_SECRET as string,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "30d",
  CLIENT_ORIGIN: process.env.CLIENT_ORIGIN || "*",
  RATE_LIMIT_WINDOW_MS:
    Number(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  RATE_LIMIT_MAX: Number(process.env.RATE_LIMIT_MAX) || 200,
};
