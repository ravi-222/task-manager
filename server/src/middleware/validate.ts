import { Request, Response, NextFunction } from "express";
import { ZodType, ZodError } from "zod";
import { AppError } from "../utils/AppError";

type RequestField = "body" | "query" | "params";

export function validate(schema: ZodType, field: RequestField = "body") {
  return (req: Request, _res: Response, next: NextFunction): void => {
    try {
      const parsed = schema.parse(req[field]);
      (req as unknown as Record<string, unknown>)[field] = parsed;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const details = error.issues.map((e) => ({
          field: String(e.path.join(".")),
          message: e.message,
        }));
        next(new AppError(422, "Validation failed", details));
      } else {
        next(error);
      }
    }
  };
}
