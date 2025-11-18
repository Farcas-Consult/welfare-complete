"use client";

import { RoleProtectedRoute } from "@/components/auth/role-protected-route";
import { useAppSelector } from "@/store/hooks";

export default function MemberDashboardPage() {
  const user = useAppSelector((state) => state.auth.user);

  return (
    <RoleProtectedRoute allowedRoles={["member"]}>
      <div className="space-y-3">
        <div>
          <h1 className="text-3xl font-bold">Member Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {user?.firstName} {user?.lastName}
          </p>
        </div>
        <p className="text-muted-foreground">
          Member-specific widgets will go here.
        </p>
      </div>
    </RoleProtectedRoute>
  );
}
