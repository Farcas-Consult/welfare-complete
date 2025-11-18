"use client";

import * as React from "react";
import type { Loan } from "../types/admin-types";
import { GenericTable } from "@/components/tables/generic-table";
import { useAdminLoansTableColumns } from "@/components/tables/table-columns/admin-dashboard-loans-columns";

interface AdminLoansCardProps {
  loans?: Loan[];
}

export function AdminLoansCard({ loans }: AdminLoansCardProps) {
  const columns = useAdminLoansTableColumns();
  const tableData = loans ?? [];
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
        <h3 className="text-base font-semibold">Loan Portfolio</h3>
        <p className="text-sm text-muted-foreground">
          Outstanding balances by application.
        </p>
      </div>
      <GenericTable
        data={tableData}
        columns={columns}
        pagination={pagination}
        setPagination={setPagination}
        pending={!loans}
        role="admin"
        tableType="admin_loans"
        withFilters={false}
        withPagination={false}
        showToolbar={false}
      />
    </section>
  );
}

