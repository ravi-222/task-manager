import { Request, Response, NextFunction } from "express";
import { taskService } from "../services/task.service";
import {
  CreateTaskInput,
  UpdateTaskInput,
  TaskQuery,
} from "../schemas/task.schema";

export const taskController = {
  async findAll(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      // Query has been parsed and coerced by validation middleware
      const result = await taskService.findAll(req.query as unknown as TaskQuery);
      res.json(result);
    } catch (error) {
      next(error);
    }
  },

  async findById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const task = await taskService.findById(req.params.id as string);
      res.json({ data: task });
    } catch (error) {
      next(error);
    }
  },

  async create(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const task = await taskService.create(req.body as CreateTaskInput, req.user!.id);
      res.status(201).json({ data: task });
    } catch (error) {
      next(error);
    }
  },

  async update(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const task = await taskService.update(req.params.id as string, req.body as UpdateTaskInput);
      res.json({ data: task });
    } catch (error) {
      next(error);
    }
  },

  async delete(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      await taskService.delete(req.params.id as string, req.user!.id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  },
};
