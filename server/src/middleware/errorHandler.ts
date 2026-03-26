import { Request, Response, NextFunction } from "express";
import { Prisma } from "@prisma/client";
import { AppError } from "../utils/AppError";
import logger from "../utils/logger";

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  // Log based on severity
  if (err instanceof AppError && err.statusCode < 500) {
    logger.warn(`${err.statusCode} - ${err.message}`);
  } else {
    logger.error(err);
  }

  // Handle known error types
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      error: {
        message: err.message,
        ...(err.details && { details: err.details }),
      },
    });
    return;
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    switch (err.code) {
      case "P2002": {
        const target = (err.meta?.target as string[])?.join(", ") ?? "field";
        res.status(409).json({
          error: { message: `A record with this ${target} already exists` },
        });
        return;
      }
      case "P2025":
        res.status(404).json({
          error: { message: "Record not found" },
        });
        return;
    }
  }

  // Unknown error — don't leak details in production
  res.status(500).json({
    error: {
      message:
        process.env.NODE_ENV === "production"
          ? "Internal server error"
          : err.message,
    },
  });
}
