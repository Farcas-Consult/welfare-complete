"use client";

import { ColumnDef } from "@tanstack/react-table";
import type { WelfareMember } from "@/app/(roles)/dashboard/admin/members/types/member-types";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

const statusClassMap: Record<string, string> = {
  active: "badge-surface-success",
  inactive: "badge-surface-muted",
  suspended: "badge-surface-warning",
  deceased: "badge-surface-destructive",
};

export const useAdminMembersTableColumns =
  (): ColumnDef<WelfareMember>[] => [
    {
      accessorKey: "name",
      header: "Member",
      cell: ({ row }) => {
        const member = row.original;
        const displayName = `${member.firstName ?? ""} ${member.lastName ?? ""}`.trim() || "—";
        return (
          <div className="flex flex-col">
            <span className="font-medium">{displayName}</span>
            <span className="text-xs text-muted-foreground">
              #{member.memberNo ?? "N/A"}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "contact",
      header: "Contact",
      cell: ({ row }) => {
        const { phonePrimary, email } = row.original;
        return (
          <div className="flex flex-col text-sm">
            <span>{phonePrimary ?? "N/A"}</span>
            {email && (
              <span className="text-xs text-muted-foreground">{email}</span>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.original.status ?? "inactive";
        return (
          <Badge
            variant="outline"
            className={`border-transparent ${
              statusClassMap[status] ?? "badge-surface-muted"
            }`}
          >
            {status.replace("_", " ")}
          </Badge>
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: "Joined",
      cell: ({ row }) => {
        const date = row.original.createdAt;
        if (!date) return <span className="text-sm text-muted-foreground">—</span>;
        return (
          <span className="text-sm text-muted-foreground">
            {format(new Date(date), "dd MMM yyyy")}
          </span>
        );
      },
    },
  ];

