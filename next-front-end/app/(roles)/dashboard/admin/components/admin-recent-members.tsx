"use client";

import * as React from "react";
import type { WelfareMember } from "@/app/(roles)/dashboard/admin/members/types/member-types";
import { GenericTable } from "@/components/tables/generic-table";
import { useAdminMembersTableColumns } from "@/components/tables/table-columns/admin-dashboard-members-columns";

interface AdminRecentMembersProps {
  members?: WelfareMember[];
}

export function AdminRecentMembers({ members }: AdminRecentMembersProps) {
  const columns = useAdminMembersTableColumns();
  const tableData = members ?? [];
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: Math.max(tableData.length || 0, 5),
  });

  React.useEffect(() => {
    setPagination((prev) => ({
      ...prev,
      pageSize: Math.max(tableData.length || 0, 5),
    }));
  }, [tableData.length]);

  return (
    <section className="space-y-3">
      <div>
        <h3 className="text-base font-semibold">Recent Members</h3>
        <p className="text-sm text-muted-foreground">
          Latest registrations across the welfare program.
        </p>
      </div>
      <GenericTable
        data={tableData}
        columns={columns}
        pagination={pagination}
        setPagination={setPagination}
        pending={!members}
        role="admin"
        tableType="admin_members"
        withFilters={false}
        withPagination={false}
        showToolbar={false}
      />
    </section>
  );
}
