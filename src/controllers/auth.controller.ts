import type { Request, Response } from "express";
import { User, type UserDocument } from "../models/User.js";
import { AppError } from "../utils/AppError.js";
import { hashPassword, comparePassword } from "../utils/password.js";
import { signToken } from "../utils/jwt.js";
import type {
  RegisterInput,
  LoginInput,
} from "../validators/auth.validator.js";

function toPublicUser(user: UserDocument) {
  return {
    id: user.id,
    username: user.username,
    email: user.email,
    avatar: user.avatar,
  };
}

export async function register(
  req: Request<unknown, unknown, RegisterInput>,
  res: Response,
): Promise<void> {
  const { username, email, password } = req.body;

  const existing = await User.findOne({ email });
  if (existing) {
    throw new AppError(409, "Email already in use");
  }

  const passwordHash = await hashPassword(password);
  const user = await User.create({ username, email, passwordHash });

  res.status(201).json({
    success: true,
    token: signToken(user.id),
    user: toPublicUser(user),
  });
}

export async function login(
  req: Request<unknown, unknown, LoginInput>,
  res: Response,
): Promise<void> {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select("+passwordHash");
  const passwordMatches = user
    ? await comparePassword(password, user.passwordHash)
    : false;

  if (!user || !passwordMatches) {
    throw new AppError(401, "Invalid email or password");
  }

  res.json({
    success: true,
    token: signToken(user.id),
    user: toPublicUser(user),
  });
}

export async function me(req: Request, res: Response): Promise<void> {
  const user = await User.findById(req.userId);

  if (!user) {
    throw new AppError(401, "User no longer exists");
  }

  res.json({ success: true, user: toPublicUser(user) });
}
