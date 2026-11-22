import jwt, { type SignOptions } from "jsonwebtoken";
import { env } from "../config/env.js";
import { AppError } from "./AppError.js";

export interface TokenPayload {
  userId: string;
}

export function signToken(userId: string): string {
  return jwt.sign({ userId }, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN as NonNullable<SignOptions["expiresIn"]>,
  });
}

export function verifyToken(token: string): TokenPayload {
  try {
    const decoded = jwt.verify(token, env.JWT_SECRET);
    if (typeof decoded === "string" || typeof decoded.userId !== "string") {
      throw new Error("Invalid token payload");
    }
    return { userId: decoded.userId };
  } catch {
    throw new AppError(401, "Invalid or expired token");
  }
}
