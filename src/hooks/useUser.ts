import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { UserService } from "../services/modules/userService";
import { User, UserUpdate } from "../interfaces/user";

export const USER_QUERY_KEYS = {
  all: ["users"] as const,
  current: () => [...USER_QUERY_KEYS.all, "current"] as const,
  detail: (id: string) => [...USER_QUERY_KEYS.all, "detail", id] as const,
};

/**
 * Hook to get current user profile
 */
export function useCurrentUser(enabled = true) {
  return useQuery({
    queryKey: USER_QUERY_KEYS.current(),
    queryFn: () => UserService.getCurrentUser(),
    enabled,
  });
}

/**
 * Hook to get user by ID
 */
export function useUser(id: string, enabled = true) {
  return useQuery({
    queryKey: USER_QUERY_KEYS.detail(id),
    queryFn: () => UserService.getUser(id),
    enabled: enabled && Boolean(id),
  });
}

/**
 * Hook to update current user profile
 */
export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UserUpdate) => UserService.updateProfile(data),
    onSuccess: (updatedUser: User) => {
      // Update current user cache
      queryClient.setQueryData(USER_QUERY_KEYS.current(), updatedUser);

      // Update specific user cache if it exists
      queryClient.setQueryData(
        USER_QUERY_KEYS.detail(updatedUser.id),
        updatedUser
      );
    },
  });
}
