"use client";

import * as React from "react";
import type { Claim } from "../types/admin-types";
import { GenericTable } from "@/components/tables/generic-table";
import { useAdminClaimsTableColumns } from "@/components/tables/table-columns/admin-dashboard-claims-columns";

interface AdminClaimsTableProps {
  claims?: Claim[];
}

export function AdminClaimsTable({ claims }: AdminClaimsTableProps) {
  const columns = useAdminClaimsTableColumns();
  const tableData = claims ?? [];
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
        <h3 className="text-base font-semibold">Claims Activity</h3>
        <p className="text-sm text-muted-foreground">
          Track incoming and approved claims.
        </p>
      </div>
      <GenericTable
        data={tableData}
        columns={columns}
        pagination={pagination}
        setPagination={setPagination}
        pending={!claims}
        role="admin"
        tableType="admin_claims"
        withFilters={false}
        withPagination={false}
        showToolbar={false}
      />
    </section>
  );
}

