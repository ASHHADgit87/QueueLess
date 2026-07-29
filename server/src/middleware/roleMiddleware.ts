import { Response, NextFunction } from "express";
import { AuthRequest } from "./authMiddleware";
import { ApiError } from "../utils/ApiError";

export const restrictTo = (
  ...roles: Array<"customer" | "business" | "admin">
) => {
  return (req: AuthRequest, _res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new ApiError(401, "Not authenticated."));
    }
    if (!roles.includes(req.user.role)) {
      return next(
        new ApiError(
          403,
          `Role "${req.user.role}" is not authorized for this action.`,
        ),
      );
    }
    next();
  };
};
