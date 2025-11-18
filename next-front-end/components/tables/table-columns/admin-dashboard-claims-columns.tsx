"use client";

import { ColumnDef } from "@tanstack/react-table";
import type { Claim } from "@/app/(roles)/dashboard/admin/types/admin-types";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

const claimStatusClassMap: Record<string, string> = {
  submitted: "badge-surface-info",
  under_review: "badge-surface-warning",
  approved: "badge-surface-success",
  rejected: "badge-surface-destructive",
  disbursed: "badge-surface-primary",
  completed: "badge-surface-muted",
};

export const useAdminClaimsTableColumns = (): ColumnDef<Claim>[] => [
  {
    accessorKey: "claimNo",
    header: "Claim",
    cell: ({ row }) => {
      const claim = row.original;
      return (
        <div className="flex flex-col">
          <span className="font-medium">{claim.claimNo}</span>
          <span className="text-xs text-muted-foreground capitalize">
            {claim.claimType}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "memberId",
    header: "Member",
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground">{row.original.memberId}</span>
    ),
  },
  {
    accessorKey: "amountRequested",
    header: "Amount",
    cell: ({ row }) => (
      <span className="font-medium">
        KES {row.original.amountRequested.toLocaleString(undefined, { maximumFractionDigits: 2 })}
      </span>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status ?? "submitted";
      return (
        <Badge
          variant="outline"
          className={`border-transparent ${
            claimStatusClassMap[status] ?? "badge-surface-muted"
          }`}
        >
          {status.replace("_", " ")}
        </Badge>
      );
    },
  },
  {
    accessorKey: "submittedAt",
    header: "Submitted",
    cell: ({ row }) => {
      const date = row.original.submittedAt || row.original.createdAt;
      if (!date) return <span className="text-sm text-muted-foreground">—</span>;
      return (
        <span className="text-sm text-muted-foreground">
          {format(new Date(date), "dd MMM yyyy")}
        </span>
      );
    },
  },
];

