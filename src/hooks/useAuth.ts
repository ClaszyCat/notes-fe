import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AuthService } from "../services/modules/authService";
import {
  RegisterRequest,
  LoginRequest,
  TokenResponse,
  User,
} from "../interfaces/auth";

export const AUTH_QUERY_KEYS = {
  currentUser: ["auth", "currentUser"] as const,
  isAuthenticated: ["auth", "isAuthenticated"] as const,
};

/**
 * Hook to check if user is authenticated
 */
export function useIsAuthenticated() {
  return useQuery({
    queryKey: AUTH_QUERY_KEYS.isAuthenticated,
    queryFn: () => AuthService.isAuthenticated(),
    staleTime: Infinity,
  });
}

/**
 * Hook for user registration
 */
export function useRegister() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: RegisterRequest) => AuthService.register(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: AUTH_QUERY_KEYS.isAuthenticated,
      });
    },
  });
}

/**
 * Hook for user login
 */
export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: LoginRequest) => AuthService.login(data),
    onSuccess: (data: TokenResponse) => {
      queryClient.setQueryData(AUTH_QUERY_KEYS.isAuthenticated, true);
      // Note: User data is not included in login response anymore
      // Will be fetched separately when needed via useCurrentUser
    },
  });
}

/**
 * Hook for user logout
 */
export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => {
      AuthService.logout();
      return Promise.resolve();
    },
    onSuccess: () => {
      queryClient.setQueryData(AUTH_QUERY_KEYS.isAuthenticated, false);
      queryClient.removeQueries({ queryKey: AUTH_QUERY_KEYS.currentUser });
      queryClient.clear();
    },
  });
}
