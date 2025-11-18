"use client";

import type { WelfareMember } from "@/app/members/types/member-types";

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export type ClaimStatus =
  | "draft"
  | "submitted"
  | "under_review"
  | "approved"
  | "rejected"
  | "disbursed"
  | "completed";

export interface Claim {
  id: string;
  claimNo: string;
  memberId: string;
  claimType: "bereavement" | "medical" | "emergency";
  amountRequested: number;
  amountApproved?: number | null;
  status: ClaimStatus;
  submittedAt?: string | null;
  createdAt?: string;
}

export interface ClaimsResponse {
  claims: Claim[];
  pagination: Pagination;
}

export type LoanStatus =
  | "application"
  | "approved"
  | "disbursed"
  | "active"
  | "completed"
  | "defaulted"
  | "written_off";

export interface Loan {
  id: string;
  loanNo: string;
  memberId: string;
  principalAmount: number;
  totalAmount: number;
  outstandingBalance?: number | null;
  status: LoanStatus;
  applicationDate?: string;
}

export interface LoansResponse {
  loans: Loan[];
  pagination: Pagination;
}

export type MeetingStatus = "scheduled" | "in_progress" | "completed" | "cancelled";

export interface Meeting {
  id: string;
  title: string;
  description?: string | null;
  meetingDate: string;
  meetingType: string;
  status: MeetingStatus;
  location?: string | null;
}

export interface MeetingsResponse {
  meetings: Meeting[];
  pagination: Pagination;
}

export interface AdminMetrics {
  totalMembers: number;
  activeMembers: number;
  pendingClaims: number;
  approvedClaims: number;
  activeLoans: number;
  loanApplications: number;
}

export interface ChartDatum {
  label: string;
  value: number;
}

export interface AdminDashboardData {
  metrics: AdminMetrics;
  recentMembers: WelfareMember[];
  recentClaims: Claim[];
  recentLoans: Loan[];
  upcomingMeetings: Meeting[];
  claimStatusSummary: ChartDatum[];
  loanStatusSummary: ChartDatum[];
}

