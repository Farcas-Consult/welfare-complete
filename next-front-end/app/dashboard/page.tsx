"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/store/hooks";
import { getDashboardUrl } from "@/lib/utils/navigation";

export default function DashboardPage() {
  const router = useRouter();
  const user = useAppSelector((state) => state.auth.user);

  useEffect(() => {
    // Redirect to role-specific dashboard if user is authenticated
    if (user?.role) {
      const dashboardUrl = getDashboardUrl(user.role);
      router.replace(dashboardUrl);
    } else {
      // If not authenticated, redirect to login
      router.replace("/auth/login");
    }
  }, [user, router]);

  // Show loading while redirecting
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        <p className="text-sm text-muted-foreground">Redirecting...</p>
      </div>
    </div>
  );
}
