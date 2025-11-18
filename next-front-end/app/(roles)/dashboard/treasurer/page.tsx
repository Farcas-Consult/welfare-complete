"use client";

import { RoleProtectedRoute } from "@/components/auth/role-protected-route";
import { useAppSelector } from "@/store/hooks";

export default function TreasurerDashboardPage() {
  const user = useAppSelector((state) => state.auth.user);

  return (
    <RoleProtectedRoute allowedRoles={["treasurer"]}>
      <div className="space-y-3">
        <div>
          <h1 className="text-3xl font-bold">Treasurer Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {user?.firstName} {user?.lastName}
          </p>
        </div>
        <p className="text-muted-foreground">
          Treasurer-specific insights will appear here.
        </p>
      </div>
    </RoleProtectedRoute>
  );
}
