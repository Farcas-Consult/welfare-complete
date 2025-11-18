"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import type { WelfareMember } from "@/app/members/types/member-types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface AdminRecentMembersProps {
  members?: WelfareMember[];
}

const statusColor: Record<string, string> = {
  active: "badge-surface-success",
  inactive: "badge-surface-muted",
  suspended: "badge-surface-warning",
  deceased: "badge-surface-destructive",
};

export function AdminRecentMembers({ members }: AdminRecentMembersProps) {
  return (
    <Card className="border-border/60">
      <CardHeader>
        <CardTitle className="text-base">Recent Members</CardTitle>
        <CardDescription>
          Latest registrations across the welfare program.
        </CardDescription>
      </CardHeader>
      <CardContent className="px-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="pl-6">Member</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="pr-6 text-right">Joined</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(members ?? []).map((member) => (
                <TableRow key={member.id} className="hover:bg-muted/40">
                  <TableCell className="pl-6 font-medium">
                    <div className="flex flex-col">
                      <span className="font-semibold">
                        {member.firstName} {member.lastName}
                      </span>
                      <span className="text-muted-foreground text-xs">
                        #{member.memberNo}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col text-sm">
                      <span>{member.phonePrimary}</span>
                      {member.email && (
                        <span className="text-muted-foreground text-xs">
                          {member.email}
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={`border-transparent ${
                        statusColor[member.status] ?? "badge-surface-muted"
                      }`}
                    >
                      {member.status.replace("_", " ")}
                    </Badge>
                  </TableCell>
                  <TableCell className="pr-6 text-right text-sm text-muted-foreground">
                    {member.createdAt
                      ? format(new Date(member.createdAt), "dd MMM yyyy")
                      : "—"}
                  </TableCell>
                </TableRow>
              ))}
              {(!members || members.length === 0) && (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="py-6 text-center text-sm text-muted-foreground"
                  >
                    No members found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
