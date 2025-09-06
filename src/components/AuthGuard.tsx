"use client";

import { useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { AuthService } from "../services/modules/authService";

interface AuthGuardProps {
  children: ReactNode;
  requireAuth?: boolean;
  redirectTo?: string;
}

export default function AuthGuard({
  children,
  requireAuth = true,
  redirectTo,
}: AuthGuardProps) {
  const router = useRouter();

  useEffect(() => {
    const isAuthenticated = AuthService.isAuthenticated();

    if (requireAuth && !isAuthenticated) {
      // User is not authenticated but authentication is required
      router.push(redirectTo || "/login");
    } else if (!requireAuth && isAuthenticated) {
      // User is authenticated but should not be (e.g., login page)
      router.push(redirectTo || "/notes");
    }
  }, [requireAuth, redirectTo, router]);

  // Always render children to avoid layout shifts
  // The redirect will handle navigation
  return <>{children}</>;
}
