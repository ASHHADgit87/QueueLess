import { Router } from "express";
import {
  listAllBusinesses,
  verifyBusiness,
  banBusiness,
  listAllUsers,
  banUser,
  deleteReview,
  getPlatformStats,
} from "../controllers/adminController";
import { protect } from "../middleware/authMiddleware";
import { restrictTo } from "../middleware/roleMiddleware";

const router = Router();

router.use(protect, restrictTo("admin"));

router.get("/stats", getPlatformStats);

router.get("/businesses", listAllBusinesses);
router.patch("/businesses/:id/verify", verifyBusiness);
router.patch("/businesses/:id/ban", banBusiness);

router.get("/users", listAllUsers);
router.patch("/users/:id/ban", banUser);

router.delete("/reviews/:id", deleteReview);

export default router;
