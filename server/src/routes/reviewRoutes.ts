import { Router } from "express";
import { replyToReview } from "../controllers/reviewController";
import { protect } from "../middleware/authMiddleware";
import { restrictTo } from "../middleware/roleMiddleware";

const router = Router();

router.use(protect);

router.patch("/:id/reply", restrictTo("business", "admin"), replyToReview);

export default router;
