"use client";

import { RoleProtectedRoute } from "@/components/auth/role-protected-route";
import { useAppSelector } from "@/store/hooks";

export default function SecretaryDashboardPage() {
  const user = useAppSelector((state) => state.auth.user);

  return (
    <RoleProtectedRoute allowedRoles={["secretary"]}>
      <div className="space-y-3">
        <div>
          <h1 className="text-3xl font-bold">Secretary Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {user?.firstName} {user?.lastName}
          </p>
        </div>
        <p className="text-muted-foreground">
          Secretary-specific workflows will be available here.
        </p>
      </div>
    </RoleProtectedRoute>
  );
}

