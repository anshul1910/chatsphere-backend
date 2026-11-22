import type { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/AppError.js";
import { verifyToken } from "../utils/jwt.js";

export function requireAuth(
  req: Request,
  _res: Response,
  next: NextFunction,
): void {
  const header = req.headers.authorization;

  if (!header?.startsWith("Bearer ")) {
    throw new AppError(401, "Authentication required");
  }

  const token = header.slice("Bearer ".length);
  const { userId } = verifyToken(token);

  req.userId = userId;
  next();
}
