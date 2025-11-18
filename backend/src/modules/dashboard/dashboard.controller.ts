import { Controller, Get, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";

import { DashboardService } from "./dashboard.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";

@ApiTags("Dashboard")
@Controller("dashboard")
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get("admin/summary")
  @ApiOperation({ summary: "Get admin dashboard KPIs" })
  async getAdminSummary() {
    const metrics = await this.dashboardService.getAdminSummary();
    return {
      message: "Admin dashboard metrics retrieved successfully",
      data: metrics,
    };
  }
}

