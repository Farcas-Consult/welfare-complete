"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/store/hooks";
import { useGetProfile } from "@/app/auth/hooks/useAuthHook";
import { WelfareRole } from "@/components/tables/types";

interface RoleProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: WelfareRole[];
  redirectTo?: string;
}

export function RoleProtectedRoute({
  children,
  allowedRoles,
  redirectTo,
}: RoleProtectedRouteProps) {
  const router = useRouter();
  const { isAuthenticated, accessToken, user, status } = useAppSelector(
    (state) => state.auth
  );

  // Fetch profile if we have token but no user
  const { isLoading: isCheckingProfile } = useGetProfile();

  useEffect(() => {
    // If not authenticated and not loading, redirect to login
    if (!isAuthenticated && !accessToken && status !== "loading") {
      router.push("/auth/login");
      return;
    }

    // If authenticated but user role is not in allowed roles
    if (isAuthenticated && user && status !== "loading" && !isCheckingProfile) {
      if (!allowedRoles.includes(user.role)) {
        // Redirect to user's dashboard if they don't have access
        const dashboardUrl = redirectTo || `/dashboard/${user.role}`;
        router.push(dashboardUrl);
      }
    }
  }, [
    isAuthenticated,
    accessToken,
    user,
    status,
    allowedRoles,
    router,
    isCheckingProfile,
    redirectTo,
  ]);

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

  // If not authenticated, don't render children
  if (!isAuthenticated || !accessToken) {
    return null;
  }

  // If user role is not allowed, don't render children (redirect will happen)
  if (user && !allowedRoles.includes(user.role)) {
    return null;
  }

  // User is authenticated and has the right role, render children
  return <>{children}</>;
}
