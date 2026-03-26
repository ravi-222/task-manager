import { TaskStatus } from "@prisma/client";
import { taskRepository } from "../repositories/task.repository";
import { AppError } from "../utils/AppError";
import {
  CreateTaskInput,
  UpdateTaskInput,
  TaskQuery,
} from "../schemas/task.schema";

export const taskService = {
  async findAll(query: TaskQuery) {
    return taskRepository.findAll({
      page: query.page,
      limit: query.limit,
      status: query.status as TaskStatus | undefined,
      assigneeId: query.assigneeId,
    });
  },

  async findById(id: string) {
    const task = await taskRepository.findById(id);
    if (!task) {
      throw new AppError(404, "Task not found");
    }
    return task;
  },

  async create(input: CreateTaskInput, createdById: string) {
    return taskRepository.create({
      title: input.title,
      description: input.description,
      status: input.status as TaskStatus | undefined,
      assigneeId: input.assigneeId,
      createdById,
      dueDate: input.dueDate ? new Date(input.dueDate) : null,
    });
  },

  async update(id: string, input: UpdateTaskInput) {
    // Verify task exists
    const existing = await taskRepository.findById(id);
    if (!existing) {
      throw new AppError(404, "Task not found");
    }

    return taskRepository.update(id, {
      ...input,
      status: input.status as TaskStatus | undefined,
      dueDate: input.dueDate !== undefined
        ? input.dueDate
          ? new Date(input.dueDate)
          : null
        : undefined,
    });
  },

  async delete(id: string, userId: string) {
    const task = await taskRepository.findById(id);
    if (!task) {
      throw new AppError(404, "Task not found");
    }

    if (task.createdById !== userId) {
      throw new AppError(403, "Only the task creator can delete this task");
    }

    await taskRepository.softDelete(id);
  },
};
