"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/store/hooks";
import { useGetProfile } from "@/app/auth/hooks/useAuthHook";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const router = useRouter();
  const { isAuthenticated, accessToken, user, status } = useAppSelector(
    (state) => state.auth
  );

  // Fetch profile if we have token but no user
  const { isLoading: isCheckingProfile } = useGetProfile();

  useEffect(() => {
    // COMMENTED OUT - Debugging reload issue
    // // If not authenticated and not loading, redirect to login
    // if (!isAuthenticated && !accessToken && status !== "loading") {
    //   router.push("/auth/login");
    // }
    console.log("ProtectedRoute - Auth state:", {
      isAuthenticated,
      accessToken: !!accessToken,
      status,
    });
  }, [isAuthenticated, accessToken, status, router]);

  // Show loading state while checking authentication
  if (status === "loading" || isCheckingProfile) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground">Checking session...</p>
        </div>
      </div>
    );
  }

  // If not authenticated, don't render children (redirect will happen)
  if (!isAuthenticated || !accessToken) {
    return null;
  }

  // User is authenticated, render children
  return <>{children}</>;
}
