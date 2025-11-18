"use client";

import Link from "next/link";
import { IconUserPlus } from "@tabler/icons-react";
import { Users, UserCheck, UserX, ShieldAlert } from "lucide-react";
import { GenericTable } from "@/components/tables/generic-table";
import { useGetMembers } from "./hooks/useMembersHook";
import { useWelfareMemberColumns } from "@/components/tables/table-columns/welfare-member-table-columns";
import { useAppSelector } from "@/store/hooks";
import { Button } from "@/components/ui/button";
import { RoleProtectedRoute } from "@/components/auth/role-protected-route";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function MembersPage() {
  const user = useAppSelector((state) => state.auth.user);
  const role = user?.role || "member";

  const columns = useWelfareMemberColumns();
  const {
    data: membersData,
    pagination,
    setPagination,
    isLoading,
    pageCount,
  } = useGetMembers();
  const members = membersData ?? [];

  // Only show create button for roles that can create members
  const canCreateMember = ["admin", "treasurer", "secretary", "committee"].includes(role);

  const totalMembers = members.length;
  const activeMembers = members.filter((member) => member.status === "active")
    .length;
  const inactiveMembers = members.filter(
    (member) => member.status === "inactive"
  ).length;
  const pendingKyc = members.filter((member) => !member.kycStatus).length;

  const memberMetrics = [
    {
      label: "Total Members",
      value: totalMembers,
      description: "All registered profiles",
      icon: Users,
    },
    {
      label: "Active Members",
      value: activeMembers,
      description: "Currently contributing",
      icon: UserCheck,
    },
    {
      label: "Inactive Members",
      value: inactiveMembers,
      description: "Paused or awaiting approval",
      icon: UserX,
    },
    {
      label: "Pending KYC",
      value: pendingKyc,
      description: "Need verification",
      icon: ShieldAlert,
    },
  ];

  return (
    <RoleProtectedRoute
      allowedRoles={["admin", "treasurer", "secretary", "committee"]}
    >
      <div className="flex flex-col gap-6">
        <div className="rounded-2xl border bg-card px-6 py-6 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-6">
            <div className="space-y-3">
              <p className="text-sm font-semibold uppercase tracking-wide text-primary">
                Member Directory
              </p>
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Members</h1>
                <p className="text-muted-foreground">
                  Monitor member onboarding, statuses, and verifications across
                  the welfare program.
                </p>
              </div>
            </div>
            {canCreateMember && (
              <div className="flex flex-wrap items-center gap-3">
                <Button variant="outline" asChild>
                  <Link href="/dashboard/admin/members/create">
                    <IconUserPlus className="mr-2 size-4" />
                    Add Member
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {memberMetrics.map((metric) => (
            <Card
              key={metric.label}
              className="border-muted bg-muted/30 shadow-none"
            >
              <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {metric.label}
                </CardTitle>
                <metric.icon className="size-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-semibold">
                  {isLoading ? "—" : metric.value}
                </div>
                <p className="text-sm text-muted-foreground">
                  {metric.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <GenericTable
          data={members}
          columns={columns}
          withFilters={true}
          withPagination={true}
          role={role}
          pending={isLoading}
          tableType="welfare_member"
          pagination={pagination}
          setPagination={setPagination}
          pageCount={pageCount}
          showCreateButton={false}
        />
      </div>
    </RoleProtectedRoute>
  );
}

