import { Router } from "express";
import { getMe, updateMe, getMyHistory } from "../controllers/userController";
import { protect } from "../middleware/authMiddleware";
import { validateRequest } from "../middleware/validateRequest";
import { updateProfileSchema } from "../validators/authValidators";

const router = Router();

router.use(protect);

router.get("/me", getMe);
router.patch("/me", validateRequest(updateProfileSchema), updateMe);
router.get("/me/history", getMyHistory);

export default router;
