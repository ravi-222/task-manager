import apiClient from "./client";
import type {
  ApiResponse,
  PaginatedResponse,
  Task,
  TaskFilters,
} from "../types";
import type { TaskFormData } from "../schemas";

export const tasksApi = {
  async getAll(filters: TaskFilters): Promise<PaginatedResponse<Task>> {
    const params = new URLSearchParams();
    params.set("page", String(filters.page));
    params.set("limit", String(filters.limit));
    if (filters.status) params.set("status", filters.status);
    if (filters.assigneeId) params.set("assigneeId", filters.assigneeId);

    const { data } = await apiClient.get<PaginatedResponse<Task>>(`/tasks?${params}`);
    return data;
  },

  async getById(id: string): Promise<Task> {
    const { data } = await apiClient.get<ApiResponse<Task>>(`/tasks/${id}`);
    return data.data;
  },

  async create(input: TaskFormData): Promise<Task> {
    const { data } = await apiClient.post<ApiResponse<Task>>("/tasks", input);
    return data.data;
  },

  async update(id: string, input: Partial<TaskFormData>): Promise<Task> {
    const { data } = await apiClient.put<ApiResponse<Task>>(`/tasks/${id}`, input);
    return data.data;
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/tasks/${id}`);
  },
};
