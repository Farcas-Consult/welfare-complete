import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { In, Repository } from "typeorm";

import { Member } from "../members/entities/member.entity";
import { Claim } from "../claims/entities/claim.entity";
import { Loan } from "../loans/entities/loan.entity";

export interface AdminDashboardMetrics {
  totalMembers: number;
  activeMembers: number;
  pendingClaims: number;
  approvedClaims: number;
  activeLoans: number;
  loanApplications: number;
}

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(Member)
    private readonly memberRepository: Repository<Member>,
    @InjectRepository(Claim)
    private readonly claimRepository: Repository<Claim>,
    @InjectRepository(Loan)
    private readonly loanRepository: Repository<Loan>
  ) {}

  async getAdminSummary(): Promise<AdminDashboardMetrics> {
    const [
      totalMembers,
      activeMembers,
      pendingClaims,
      approvedClaims,
      activeLoans,
      loanApplications,
    ] = await Promise.all([
      this.memberRepository.count(),
      this.memberRepository.count({ where: { status: "active" } }),
      this.claimRepository.count({
        where: {
          status: In(["submitted", "under_review"]),
        },
      }),
      this.claimRepository.count({
        where: {
          status: In(["approved", "disbursed"]),
        },
      }),
      this.loanRepository.count({
        where: {
          status: In(["active", "disbursed"]),
        },
      }),
      this.loanRepository.count({
        where: { status: "application" },
      }),
    ]);

    return {
      totalMembers,
      activeMembers,
      pendingClaims,
      approvedClaims,
      activeLoans,
      loanApplications,
    };
  }
}

