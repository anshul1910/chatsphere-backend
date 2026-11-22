import type { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/AppError.js";

function isDuplicateKeyError(err: unknown): boolean {
  return (
    typeof err === "object" &&
    err !== null &&
    "code" in err &&
    err.code === 11000
  );
}

export function notFound(req: Request, res: Response): void {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
}

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({ success: false, message: err.message });
    return;
  }

  if (isDuplicateKeyError(err)) {
    res
      .status(409)
      .json({ success: false, message: "Resource already exists" });
    return;
  }

  console.error(err);
  res.status(500).json({ success: false, message: "Internal server error" });
}
