import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ReportsService } from './reports.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Reports')
@Controller('reports')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('summary')
  @ApiOperation({ summary: 'Get summary report' })
  async getSummary(@Query() query: any) {
    return this.reportsService.getSummary(query);
  }

  @Get('contributions')
  @ApiOperation({ summary: 'Get contributions report' })
  async getContributionsReport(@Query() query: any) {
    return this.reportsService.getContributionsReport(query);
  }
}

