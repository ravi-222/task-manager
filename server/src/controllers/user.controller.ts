import { Request, Response, NextFunction } from "express";
import { userService } from "../services/user.service";

export const userController = {
  async findAll(
    _req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const users = await userService.findAll();
      res.json({ data: users });
    } catch (error) {
      next(error);
    }
  },
};
