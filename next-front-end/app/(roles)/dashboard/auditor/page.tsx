"use client";

import { RoleProtectedRoute } from "@/components/auth/role-protected-route";
import { useAppSelector } from "@/store/hooks";

export default function AuditorDashboardPage() {
  const user = useAppSelector((state) => state.auth.user);

  return (
    <RoleProtectedRoute allowedRoles={["auditor"]}>
      <div className="space-y-3">
        <div>
          <h1 className="text-3xl font-bold">Auditor Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {user?.firstName} {user?.lastName}
          </p>
        </div>
        <p className="text-muted-foreground">
          Auditor oversight panels will be surfaced here.
        </p>
      </div>
    </RoleProtectedRoute>
  );
}
