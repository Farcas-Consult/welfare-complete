"use client";

import { RoleProtectedRoute } from "@/components/auth/role-protected-route";
import { useAppSelector } from "@/store/hooks";

export default function CommitteeDashboardPage() {
  const user = useAppSelector((state) => state.auth.user);

  return (
    <RoleProtectedRoute allowedRoles={["committee"]}>
      <div className="space-y-3">
        <div>
          <h1 className="text-3xl font-bold">Committee Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {user?.firstName} {user?.lastName}
          </p>
        </div>
        <p className="text-muted-foreground">
          Committee tasks and approvals will appear here.
        </p>
      </div>
    </RoleProtectedRoute>
  );
}
