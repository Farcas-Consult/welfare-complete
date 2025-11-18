"use client";

import { useQuery } from "@tanstack/react-query";
import { adminService } from "../services/adminService";

export function useAdminDashboard() {
  return useQuery({
    queryKey: ["admin-dashboard"],
    queryFn: () => adminService.getDashboardData(),
    staleTime: 1000 * 60, // 1 minute
  });
}
