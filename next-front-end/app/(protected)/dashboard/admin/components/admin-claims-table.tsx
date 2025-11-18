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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { Claim } from "../types/admin-types";
import { format } from "date-fns";

interface AdminClaimsTableProps {
  claims?: Claim[];
}

const claimStatusStyles: Record<string, string> = {
  submitted: "badge-surface-info",
  under_review: "badge-surface-warning",
  approved: "badge-surface-success",
  rejected: "badge-surface-destructive",
  disbursed: "badge-surface-primary",
  completed: "badge-surface-muted",
};

export function AdminClaimsTable({ claims }: AdminClaimsTableProps) {
  return (
    <Card className="border-border/60">
      <CardHeader>
        <CardTitle className="text-base">Claims Activity</CardTitle>
        <CardDescription>Track incoming and approved claims.</CardDescription>
      </CardHeader>
      <CardContent className="px-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="pl-6">Claim</TableHead>
                <TableHead>Member</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="pr-6 text-right">Submitted</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(claims ?? []).map((claim) => (
                <TableRow key={claim.id} className="hover:bg-muted/40">
                  <TableCell className="pl-6">
                    <div className="flex flex-col">
                      <span className="font-semibold">{claim.claimNo}</span>
                      <span className="text-muted-foreground text-xs capitalize">{claim.claimType}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{claim.memberId}</TableCell>
                  <TableCell className="font-medium">
                    KES {claim.amountRequested.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={`border-transparent ${
                        claimStatusStyles[claim.status] ?? "badge-surface-muted"
                      }`}
                    >
                      {claim.status.replace("_", " ")}
                    </Badge>
                  </TableCell>
                  <TableCell className="pr-6 text-right text-sm text-muted-foreground">
                    {claim.submittedAt
                      ? format(new Date(claim.submittedAt), "dd MMM yyyy")
                      : claim.createdAt
                      ? format(new Date(claim.createdAt), "dd MMM yyyy")
                      : "—"}
                  </TableCell>
                </TableRow>
              ))}
              {(!claims || claims.length === 0) && (
                <TableRow>
                  <TableCell colSpan={5} className="py-6 text-center text-sm text-muted-foreground">
                    No claims found.
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

