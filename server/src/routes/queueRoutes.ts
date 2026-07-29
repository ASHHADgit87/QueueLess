import { Router } from "express";
import { updateQueue, deleteQueue } from "../controllers/queueController";
import {
  joinQueue,
  leaveQueue,
  addWalkIn,
  getQueueEntries,
  callNext,
} from "../controllers/queueEntryController";
import { protect } from "../middleware/authMiddleware";
import { restrictTo } from "../middleware/roleMiddleware";
import { validateRequest } from "../middleware/validateRequest";
import { updateQueueSchema, walkInSchema } from "../validators/queueValidators";

const router = Router();

router.use(protect);

router.patch(
  "/:id",
  restrictTo("business", "admin"),
  validateRequest(updateQueueSchema),
  updateQueue,
);
router.delete("/:id", restrictTo("business", "admin"), deleteQueue);

router.post("/:id/join", restrictTo("customer"), joinQueue);
router.delete("/:id/leave", restrictTo("customer"), leaveQueue);

router.post(
  "/:id/walk-in",
  restrictTo("business", "admin"),
  validateRequest(walkInSchema),
  addWalkIn,
);
router.get("/:id/entries", restrictTo("business", "admin"), getQueueEntries);
router.patch("/:id/call-next", restrictTo("business", "admin"), callNext);

export default router;
