import { Router } from "express";
import {
  listBusinesses,
  getBusinessById,
  createBusiness,
  getMyBusinesses,
  updateBusiness,
  deleteBusiness,
  getBusinessAnalyticsController,
} from "../controllers/businessController";
import {
  createReview,
  getReviewsForBusiness,
} from "../controllers/reviewController";
import {
  createQueue,
  getQueuesForBusiness,
} from "../controllers/queueController";
import { protect, optionalAuth } from "../middleware/authMiddleware";
import { restrictTo } from "../middleware/roleMiddleware";
import { validateRequest } from "../middleware/validateRequest";
import {
  createBusinessSchema,
  updateBusinessSchema,
  createReviewSchema,
} from "../validators/businessValidators";
import { createQueueSchema } from "../validators/queueValidators";

const router = Router();

router.get("/", optionalAuth, listBusinesses);

router.get("/mine", protect, restrictTo("business", "admin"), getMyBusinesses);

router.get("/:id", optionalAuth, getBusinessById);

router.post(
  "/",
  protect,
  restrictTo("business"),
  validateRequest(createBusinessSchema),
  createBusiness,
);
router.patch(
  "/:id",
  protect,
  restrictTo("business", "admin"),
  validateRequest(updateBusinessSchema),
  updateBusiness,
);
router.delete("/:id", protect, restrictTo("business", "admin"), deleteBusiness);

router.get("/:businessId/queues", getQueuesForBusiness);
router.post(
  "/:businessId/queues",
  protect,
  restrictTo("business", "admin"),
  validateRequest(createQueueSchema),
  createQueue,
);

router.get(
  "/:id/analytics",
  protect,
  restrictTo("business", "admin"),
  getBusinessAnalyticsController,
);

router.get("/:id/reviews", getReviewsForBusiness);
router.post(
  "/:id/reviews",
  protect,
  restrictTo("customer"),
  validateRequest(createReviewSchema),
  createReview,
);

export default router;
