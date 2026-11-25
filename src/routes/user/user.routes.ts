import { Router } from "express";
import {
  getUserById,
  searchUsers,
  updateMe,
  uploadMyAvatar,
} from "../../controllers/user/user.controller.js";
import { requireAuth } from "../../middleware/auth.js";
import { uploadAvatarFile } from "../../middleware/upload.js";

const router = Router();

router.use(requireAuth);

router.get("/search", searchUsers);
router.patch("/me", updateMe);
router.post("/me/avatar", uploadAvatarFile, uploadMyAvatar);
router.get("/:id", getUserById);

export default router;
