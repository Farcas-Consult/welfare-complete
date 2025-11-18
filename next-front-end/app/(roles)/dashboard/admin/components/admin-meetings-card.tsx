"use client";

import * as React from "react";
import type { Meeting } from "../types/admin-types";
import { GenericTable } from "@/components/tables/generic-table";
import { useAdminMeetingsTableColumns } from "@/components/tables/table-columns/admin-dashboard-meetings-columns";
import { Button } from "@/components/ui/button";

interface AdminMeetingsCardProps {
  meetings?: Meeting[];
}

export function AdminMeetingsCard({ meetings }: AdminMeetingsCardProps) {
  const columns = useAdminMeetingsTableColumns();
  const tableData = meetings ?? [];
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
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-base font-semibold">Upcoming Meetings</h3>
          <p className="text-sm text-muted-foreground">
            Touchpoints scheduled for committees.
          </p>
        </div>
        <Button variant="outline" size="sm">
          View all
        </Button>
      </div>
      <GenericTable
        data={tableData}
        columns={columns}
        pagination={pagination}
        setPagination={setPagination}
        pending={!meetings}
        role="admin"
        tableType="admin_meetings"
        withFilters={false}
        withPagination={false}
        showToolbar={false}
      />
    </section>
  );
}
