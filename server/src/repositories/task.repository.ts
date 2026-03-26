import { TaskStatus } from "@prisma/client";
import prisma from "../utils/prisma";

const taskInclude = {
  assignee: { select: { id: true, name: true, email: true } },
  createdBy: { select: { id: true, name: true, email: true } },
} as const;

interface FindAllParams {
  page: number;
  limit: number;
  status?: TaskStatus;
  assigneeId?: string;
}

export const taskRepository = {
  async findAll({ page, limit, status, assigneeId }: FindAllParams) {
    const where = {
      deletedAt: null,
      ...(status && { status }),
      ...(assigneeId && { assigneeId }),
    };

    const [data, total] = await Promise.all([
      prisma.task.findMany({
        where,
        include: taskInclude,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.task.count({ where }),
    ]);

    return {
      data,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  },

  async findById(id: string) {
    return prisma.task.findFirst({
      where: { id, deletedAt: null },
      include: taskInclude,
    });
  },

  async create(data: {
    title: string;
    description?: string;
    status?: TaskStatus;
    assigneeId?: string | null;
    createdById: string;
    dueDate?: Date | null;
  }) {
    return prisma.task.create({
      data,
      include: taskInclude,
    });
  },

  async update(
    id: string,
    data: {
      title?: string;
      description?: string | null;
      status?: TaskStatus;
      assigneeId?: string | null;
      dueDate?: Date | null;
    }
  ) {
    return prisma.task.update({
      where: { id },
      data,
      include: taskInclude,
    });
  },

  async softDelete(id: string) {
    return prisma.task.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  },
};
