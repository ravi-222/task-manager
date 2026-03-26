import apiClient from "./client";
import type { ApiResponse, AuthResponse, User } from "../types";

export const authApi = {
  async login(email: string, password: string): Promise<AuthResponse> {
    const { data } = await apiClient.post<ApiResponse<AuthResponse>>("/auth/login", {
      email,
      password,
    });
    return data.data;
  },

  async register(name: string, email: string, password: string): Promise<AuthResponse> {
    const { data } = await apiClient.post<ApiResponse<AuthResponse>>("/auth/register", {
      name,
      email,
      password,
    });
    return data.data;
  },

  async getMe(): Promise<User> {
    const { data } = await apiClient.get<ApiResponse<User>>("/auth/me");
    return data.data;
  },
};
