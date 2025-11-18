"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { AdminMetrics } from "../types/admin-types";

interface AdminOverviewCardsProps {
  metrics: AdminMetrics | undefined;
}

const metricConfig = [
  {
    key: "totalMembers" as const,
    label: "Total Members",
    description: "All registered members",
    accent: "text-chart-4",
  },
  {
    key: "activeMembers" as const,
    label: "Active Members",
    description: "Currently contributing",
    accent: "text-chart-3",
  },
  {
    key: "pendingClaims" as const,
    label: "Pending Claims",
    description: "Awaiting approval",
    accent: "text-chart-2",
  },
  {
    key: "approvedClaims" as const,
    label: "Approved Claims",
    description: "Cleared for payout",
    accent: "text-chart-1",
  },
  {
    key: "activeLoans" as const,
    label: "Active Loans",
    description: "Currently servicing",
    accent: "text-chart-5",
  },
  {
    key: "loanApplications" as const,
    label: "Loan Applications",
    description: "Awaiting review",
    accent: "text-chart-2",
  },
];

export function AdminOverviewCards({ metrics }: AdminOverviewCardsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {metricConfig.map((metric) => (
        <Card key={metric.key} className="border-border/60">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{metric.label}</CardTitle>
            <span className={`text-xs font-medium ${metric.accent}`}>Live</span>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {metrics ? metrics[metric.key].toLocaleString() : "—"}
            </div>
            <CardDescription>{metric.description}</CardDescription>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

