import { Controller, Get, Post, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ContributionsService } from './contributions.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Contributions')
@Controller('contributions')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ContributionsController {
  constructor(private readonly contributionsService: ContributionsService) {}

  @Get('invoices')
  @ApiOperation({ summary: 'Get all invoices' })
  async getInvoices(@Query() query: any) {
    return this.contributionsService.getInvoices(query);
  }

  @Get('invoices/:id')
  @ApiOperation({ summary: 'Get invoice by ID' })
  async getInvoice(@Param('id') id: string) {
    return this.contributionsService.getInvoice(id);
  }

  @Get('plans')
  @ApiOperation({ summary: 'Get all membership plans' })
  async getPlans() {
    return this.contributionsService.getPlans();
  }
}

