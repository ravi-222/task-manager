import { useQuery } from "@tanstack/react-query";
import { usersApi } from "../api/users";

export function useUsers() {
  return useQuery({
    queryKey: ["users"],
    queryFn: () => usersApi.getAll(),
    staleTime: 5 * 60 * 1000, // Users rarely change — cache for 5 minutes
  });
}
