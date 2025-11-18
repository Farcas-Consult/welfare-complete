"use client";
import { RoleProtectedRoute } from "@/components/auth/role-protected-route";
import { useAppSelector } from "@/store/hooks";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CalendarIcon, DownloadIcon } from "lucide-react";

import { AdminOverviewCards } from "@/app/(roles)/dashboard/admin/components/admin-overview-cards";
import { AdminClaimsStatusChart } from "@/app/(roles)/dashboard/admin/components/admin-claims-status-chart";
import { AdminRecentMembers } from "@/app/(roles)/dashboard/admin/components/admin-recent-members";
import { AdminClaimsTable } from "@/app/(roles)/dashboard/admin/components/admin-claims-table";
import { AdminMeetingsCard } from "@/app/(roles)/dashboard/admin/components/admin-meetings-card";
import { AdminLoansCard } from "@/app/(roles)/dashboard/admin/components/admin-loans-card";

import { AdminListCardSkeleton } from "@/components/skeletons/admin/list-card-skeleton";
import { useAdminDashboard } from "@/app/(roles)/dashboard/admin/hooks/useAdminDashboard";
import { AdminOverviewCardsSkeleton } from "@/components/skeletons/admin/overview-cards-skeleton";
import { AdminChartCardSkeleton } from "@/components/skeletons/admin/chart-card-skeleton";
import { AdminTableCardSkeleton } from "@/components/skeletons/admin/table-card-skeleton";

export default function AdminDashboardPage() {
  const user = useAppSelector((state) => state.auth.user);

  const { data, isLoading } = useAdminDashboard();

  return (
    <RoleProtectedRoute allowedRoles={["admin"]}>
      <div className="flex flex-1 flex-col gap-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Admin Control Center
            </h1>
            <p className="text-muted-foreground">
              Welcome back, {user?.firstName} {user?.lastName}. Monitor welfare
              operations at a glance.
            </p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <div className="flex items-center gap-2">
              <CalendarIcon className="text-muted-foreground size-4" />
              <span className="text-sm text-muted-foreground">Today</span>
            </div>
            <div className="flex items-center gap-2">
              <Input
                placeholder="Search reports"
                className="w-[200px] lg:w-[250px]"
              />
              <Button variant="outline" className="gap-2">
                <DownloadIcon className="size-4" />
                Export
              </Button>
            </div>
          </div>
        </div>

        {isLoading ? (
          <AdminOverviewCardsSkeleton />
        ) : (
          <AdminOverviewCards metrics={data?.metrics} />
        )}

        <div className="grid gap-4 lg:grid-cols-7">
          <div className="col-span-7 lg:col-span-4">
            {isLoading ? (
              <AdminChartCardSkeleton />
            ) : (
              <AdminClaimsStatusChart data={data?.claimStatusSummary} />
            )}
          </div>
          <div className="col-span-7 lg:col-span-3">
            {isLoading ? (
              <AdminListCardSkeleton />
            ) : (
              <AdminMeetingsCard meetings={data?.upcomingMeetings} />
            )}
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          {isLoading ? (
            <AdminTableCardSkeleton />
          ) : (
            <AdminRecentMembers members={data?.recentMembers} />
          )}
          {isLoading ? (
            <AdminTableCardSkeleton />
          ) : (
            <AdminClaimsTable claims={data?.recentClaims} />
          )}
        </div>

        <div>
          {isLoading ? (
            <AdminListCardSkeleton />
          ) : (
            <AdminLoansCard loans={data?.recentLoans} />
          )}
        </div>
      </div>
    </RoleProtectedRoute>
  );
}
