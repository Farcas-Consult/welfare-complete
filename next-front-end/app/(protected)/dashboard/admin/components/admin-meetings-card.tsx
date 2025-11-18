"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Meeting } from "../types/admin-types";
import { format } from "date-fns";
import { CalendarIcon, MapPinIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface AdminMeetingsCardProps {
  meetings?: Meeting[];
}

export function AdminMeetingsCard({ meetings }: AdminMeetingsCardProps) {
  return (
    <Card className="border-border/60">
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <div>
          <CardTitle className="text-base">Upcoming Meetings</CardTitle>
          <CardDescription>Touchpoints scheduled for committees.</CardDescription>
        </div>
        <Button variant="outline" size="sm">
          View all
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {(meetings ?? []).map((meeting) => (
          <div
            key={meeting.id}
            className="border-border/60 rounded-lg border p-4 transition hover:bg-muted/40"
          >
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold">{meeting.title}</p>
                <p className="text-muted-foreground text-xs capitalize">{meeting.meetingType}</p>
              </div>
              <BadgeByStatus status={meeting.status} />
            </div>
            <div className="mt-3 space-y-1 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <CalendarIcon className="size-4" />
                <span>{format(new Date(meeting.meetingDate), "dd MMM yyyy, HH:mm")}</span>
              </div>
              {meeting.location && (
                <div className="flex items-center gap-2">
                  <MapPinIcon className="size-4" />
                  <span>{meeting.location}</span>
                </div>
              )}
            </div>
          </div>
        ))}
        {(!meetings || meetings.length === 0) && (
          <p className="text-center text-sm text-muted-foreground">No scheduled meetings.</p>
        )}
      </CardContent>
    </Card>
  );
}

function BadgeByStatus({ status }: { status: string }) {
  const styles: Record<string, string> = {
    scheduled: "badge-surface-info",
    in_progress: "badge-surface-warning",
    completed: "badge-surface-success",
    cancelled: "badge-surface-destructive",
  };
  return (
    <Badge
      variant="outline"
      className={`border-transparent px-3 ${styles[status] ?? "badge-surface-muted"}`}
    >
      {status.replace("_", " ")}
    </Badge>
  );
}

