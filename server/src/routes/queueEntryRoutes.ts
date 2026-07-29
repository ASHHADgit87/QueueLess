import { Router } from "express";
import { markNoShow } from "../controllers/queueEntryController";
import { protect } from "../middleware/authMiddleware";
import { restrictTo } from "../middleware/roleMiddleware";

const router = Router();

router.use(protect);

router.patch("/:id/no-show", restrictTo("business", "admin"), markNoShow);

export default router;
