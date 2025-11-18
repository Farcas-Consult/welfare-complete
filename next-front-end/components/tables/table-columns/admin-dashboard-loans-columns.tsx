"use client";

import { ColumnDef } from "@tanstack/react-table";
import type { Loan } from "@/app/(roles)/dashboard/admin/types/admin-types";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const loanStatusClassMap: Record<string, string> = {
  application: "badge-surface-info",
  approved: "badge-surface-success",
  disbursed: "badge-surface-primary",
  active: "badge-surface-warning",
  completed: "badge-surface-muted",
  defaulted: "badge-surface-destructive",
  written_off: "badge-surface-muted",
};

export const useAdminLoansTableColumns = (): ColumnDef<Loan>[] => [
  {
    accessorKey: "loanNo",
    header: "Loan",
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span className="font-medium">{row.original.loanNo}</span>
        <span className="text-xs text-muted-foreground">{row.original.memberId}</span>
      </div>
    ),
  },
  {
    accessorKey: "principalAmount",
    header: "Principal",
    cell: ({ row }) => (
      <span className="font-medium">
        KES {row.original.principalAmount.toLocaleString(undefined, { maximumFractionDigits: 2 })}
      </span>
    ),
  },
  {
    accessorKey: "outstandingBalance",
    header: "Outstanding",
    cell: ({ row }) => (
      <span className="text-sm">
        KES {(row.original.outstandingBalance ?? 0).toLocaleString(undefined, { maximumFractionDigits: 2 })}
      </span>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status ?? "application";
      return (
        <Badge
          variant="outline"
          className={`border-transparent ${
            loanStatusClassMap[status] ?? "badge-surface-muted"
          }`}
        >
          {status.replace("_", " ")}
        </Badge>
      );
    },
  },
  {
    accessorKey: "progress",
    header: "Progress",
    cell: ({ row }) => {
      const loan = row.original;
      const total = loan.totalAmount || loan.principalAmount || 0;
      const paid = total - (loan.outstandingBalance ?? total);
      const percent = total > 0 ? Math.min(100, Math.max(0, (paid / total) * 100)) : 0;

      return (
        <div className="flex flex-col gap-1">
          <Progress value={percent} className="h-2" />
          <span className="text-xs text-muted-foreground">
            {percent.toFixed(0)}%
          </span>
        </div>
      );
    },
  },
];

