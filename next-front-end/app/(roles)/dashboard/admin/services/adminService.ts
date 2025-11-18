"use client";

import { membersService } from "@/app/(roles)/dashboard/admin/members/services/membersService";
import { fetchData } from "@/lib/api/httpClient";
import type {
  AdminDashboardData,
  AdminMetrics,
  Claim,
  ClaimsResponse,
  Loan,
  LoansResponse,
  Meeting,
  MeetingsResponse,
} from "../types/admin-types";

const toQueryParams = (params: Record<string, string | number | undefined>) =>
  Object.entries(params).reduce<Record<string, string>>((acc, [key, value]) => {
    if (value === undefined || value === null) {
      return acc;
    }
    acc[key] = String(value);
    return acc;
  }, {});

async function getClaims(query?: Record<string, string | number | undefined>) {
  const response = await fetchData<{ data: ClaimsResponse }>("/claims", toQueryParams(query ?? {}));
  return response.data;
}

async function getLoans(query?: Record<string, string | number | undefined>) {
  const response = await fetchData<{ data: LoansResponse }>("/loans", toQueryParams(query ?? {}));
  return response.data;
}

async function getMeetings(query?: Record<string, string | number | undefined>) {
  const response = await fetchData<{ data: MeetingsResponse }>(
    "/meetings",
    toQueryParams(query ?? {})
  );
  return response.data;
}

async function getAdminMetrics() {
  const response = await fetchData<{ data: AdminMetrics }>(
    "/dashboard/admin/summary"
  );
  return response.data;
}

export const adminService = {
  async getDashboardData(): Promise<AdminDashboardData> {
    const [
      metrics,
      memberList,
      claimsList,
      loansList,
      meetingsList,
    ] = await Promise.all([
      getAdminMetrics(),
      membersService.getAll({ page: 1, limit: 5 }),
      getClaims({ page: 1, limit: 5 }),
      getLoans({ page: 1, limit: 5 }),
      getMeetings({ page: 1, limit: 5, status: "scheduled" }),
    ]);

    const normalizeAmount = (value: number | string | undefined | null) =>
      typeof value === "number" ? value : value ? Number(value) : 0;

    const recentClaims = claimsList.claims.map((claim) => ({
      ...claim,
      amountRequested: normalizeAmount(claim.amountRequested),
      amountApproved: normalizeAmount(claim.amountApproved ?? undefined),
    }));

    const recentLoans = loansList.loans.map((loan) => ({
      ...loan,
      principalAmount: normalizeAmount(loan.principalAmount),
      totalAmount: normalizeAmount(loan.totalAmount),
      outstandingBalance: normalizeAmount(loan.outstandingBalance ?? undefined),
    }));

    const claimStatusSummary = [
      { label: "Submitted", value: metrics.pendingClaims },
      { label: "Approved", value: metrics.approvedClaims },
      { label: "All", value: claimsList.pagination.total },
    ];

    const loanStatusSummary = [
      { label: "Active", value: metrics.activeLoans },
      { label: "Applications", value: metrics.loanApplications },
      { label: "Total", value: loansList.pagination.total },
    ];

    return {
      metrics,
      recentMembers: memberList.members,
      recentClaims,
      recentLoans,
      upcomingMeetings: meetingsList.meetings,
      claimStatusSummary,
      loanStatusSummary,
    };
  },
};

