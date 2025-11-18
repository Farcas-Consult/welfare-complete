import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { DashboardController } from "./dashboard.controller";
import { DashboardService } from "./dashboard.service";
import { Member } from "../members/entities/member.entity";
import { Claim } from "../claims/entities/claim.entity";
import { Loan } from "../loans/entities/loan.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Member, Claim, Loan])],
  controllers: [DashboardController],
  providers: [DashboardService],
  exports: [DashboardService],
})
export class DashboardModule {}

