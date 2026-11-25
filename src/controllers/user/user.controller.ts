import type { Request, Response } from "express";
import { User } from "../../models/user/user.model.js";
import { AppError } from "../../utils/AppError.js";
import { escapeRegex } from "../../utils/escapeRegex.js";
import { serializeSelf, serializeUser } from "../../utils/serializers.js";
import {
  searchUsersQuerySchema,
  updateProfileSchema,
  userIdParamSchema,
} from "../../validators/user/user.validator.js";
import { uploadAvatar } from "../../utils/uploadAvatar.js";

export async function searchUsers(req: Request, res: Response): Promise<void> {
  const { q, limit } = searchUsersQuerySchema.parse(req.query);
  const pattern = new RegExp(escapeRegex(q), "i");

  const users = await User.find({
    _id: { $ne: req.userId },
    $or: [{ username: pattern }, { email: q.toLowerCase() }],
  })
    .sort({ username: 1 })
    .limit(limit);

  res.json({ success: true, users: users.map(serializeUser) });
}

export async function getUserById(req: Request, res: Response): Promise<void> {
  const { id } = userIdParamSchema.parse(req.params);

  const user = await User.findById(id);
  if (!user) {
    throw new AppError(404, "User not found");
  }

  res.json({
    success: true,
    user: { ...serializeUser(user), createdAt: user.createdAt },
  });
}

export async function updateMe(req: Request, res: Response): Promise<void> {
  const updates = updateProfileSchema.parse(req.body);

  const user = await User.findByIdAndUpdate(req.userId, updates, {
    new: true,
    runValidators: true,
  });
  if (!user) {
    throw new AppError(404, "User not found");
  }

  res.json({ success: true, user: serializeSelf(user) });
}

export async function uploadMyAvatar(req: Request, res: Response) {
  const userId = req.userId;
  if (!userId) throw new AppError(401, "Not authenticated");
  if (!req.file) throw new AppError(400, "No image uploaded");

  const url = await uploadAvatar(req.file.buffer, userId);
  const avatar = `${url}?v=${Date.now()}`;

  const user = await User.findByIdAndUpdate(
    userId,
    { avatar },
    { new: true, runValidators: true },
  );
  if (!user) throw new AppError(404, "User not found");

  res.json({ success: true, user: serializeSelf(user) });
}
