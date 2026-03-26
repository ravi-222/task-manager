export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export type TaskStatus = "TODO" | "IN_PROGRESS" | "DONE";

export interface Task {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  assigneeId: string | null;
  assignee: Pick<User, "id" | "name" | "email"> | null;
  createdById: string;
  createdBy: Pick<User, "id" | "name" | "email">;
  dueDate: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ApiResponse<T> {
  data: T;
}

export interface ApiError {
  error: {
    message: string;
    details?: Array<{ field: string; message: string }>;
  };
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface TaskFilters {
  page: number;
  limit: number;
  status?: TaskStatus;
  assigneeId?: string;
}
