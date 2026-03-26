import apiClient from "./client";
import type { ApiResponse, User } from "../types";

export const usersApi = {
  async getAll(): Promise<User[]> {
    const { data } = await apiClient.get<ApiResponse<User[]>>("/users");
    return data.data;
  },
};
