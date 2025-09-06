"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AuthService } from "../services/modules/authService";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Check if user is authenticated and redirect accordingly
    const isAuthenticated = AuthService.isAuthenticated();

    if (isAuthenticated) {
      router.push("/notes");
    } else {
      router.push("/login");
    }
  }, [router]);

  // Show loading while redirecting
  return (
    <div className="font-sans flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
        <p>Loading...</p>
      </div>
    </div>
  );
}
