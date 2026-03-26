import prisma from "../utils/prisma";

const userSelect = {
  id: true,
  email: true,
  name: true,
  createdAt: true,
  updatedAt: true,
} as const;

export const userRepository = {
  async findByEmail(email: string) {
    return prisma.user.findFirst({
      where: { email, deletedAt: null },
    });
  },

  async findById(id: string) {
    return prisma.user.findFirst({
      where: { id, deletedAt: null },
      select: userSelect,
    });
  },

  async create(data: { email: string; password: string; name: string }) {
    return prisma.user.create({
      data,
      select: userSelect,
    });
  },

  async findAll() {
    return prisma.user.findMany({
      where: { deletedAt: null },
      select: userSelect,
      orderBy: { name: "asc" },
    });
  },
};
