import jwt from "jsonwebtoken";
import { env } from "../config/env";

export interface TokenPayload {
  id: string;
  role: "customer" | "business" | "admin";
}

export const generateToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN,
  } as jwt.SignOptions);
};
