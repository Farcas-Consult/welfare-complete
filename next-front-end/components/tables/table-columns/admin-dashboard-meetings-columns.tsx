"use client";

import { ColumnDef } from "@tanstack/react-table";
import type { Meeting } from "@/app/(roles)/dashboard/admin/types/admin-types";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

const meetingStatusClassMap: Record<string, string> = {
  scheduled: "badge-surface-info",
  in_progress: "badge-surface-warning",
  completed: "badge-surface-success",
  cancelled: "badge-surface-destructive",
};

export const useAdminMeetingsTableColumns = (): ColumnDef<Meeting>[] => [
  {
    accessorKey: "title",
    header: "Meeting",
    cell: ({ row }) => {
      const meeting = row.original;
      return (
        <div className="flex flex-col">
          <span className="font-medium">{meeting.title}</span>
          <span className="text-xs text-muted-foreground capitalize">
            {meeting.meetingType}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "meetingDate",
    header: "Date",
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground">
        {format(new Date(row.original.meetingDate), "dd MMM yyyy, HH:mm")}
      </span>
    ),
  },
  {
    accessorKey: "location",
    header: "Location",
    cell: ({ row }) => (
      <span className="text-sm">
        {row.original.location ?? "—"}
      </span>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status ?? "scheduled";
      return (
        <Badge
          variant="outline"
          className={`border-transparent ${
            meetingStatusClassMap[status] ?? "badge-surface-muted"
          }`}
        >
          {status.replace("_", " ")}
        </Badge>
      );
    },
  },
];

