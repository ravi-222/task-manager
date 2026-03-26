import { Request, Response, NextFunction } from "express";
import { authService } from "../services/auth.service";
import { RegisterInput, LoginInput } from "../schemas/auth.schema";

export const authController = {
  async register(
    req: Request<unknown, unknown, RegisterInput>,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const result = await authService.register(req.body);
      res.status(201).json({ data: result });
    } catch (error) {
      next(error);
    }
  },

  async login(
    req: Request<unknown, unknown, LoginInput>,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const result = await authService.login(req.body);
      res.json({ data: result });
    } catch (error) {
      next(error);
    }
  },

  async me(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const user = await authService.getMe(req.user!.id);
      res.json({ data: user });
    } catch (error) {
      next(error);
    }
  },
};
