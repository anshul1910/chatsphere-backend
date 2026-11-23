import { Router } from "express";
import {
  getUserById,
  searchUsers,
  updateMe,
} from "../../controllers/user/user.controller.js";
import { requireAuth } from "../../middleware/auth.js";

const router = Router();

router.use(requireAuth);

router.get("/search", searchUsers);
router.patch("/me", updateMe);
router.get("/:id", getUserById);

export default router;
