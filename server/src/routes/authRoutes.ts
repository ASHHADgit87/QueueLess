import { Router } from "express";
import { register, login, logout } from "../controllers/authController";
import { validateRequest } from "../middleware/validateRequest";
import { registerSchema, loginSchema } from "../validators/authValidators";
import { authLimiter } from "../middleware/rateLimiter";

const router = Router();

router.post(
  "/register",
  authLimiter,
  validateRequest(registerSchema),
  register,
);
router.post("/login", authLimiter, validateRequest(loginSchema), login);
router.post("/logout", logout);

export default router;
