import { Controller, Get, Post, Put, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { LoansService } from './loans.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Loans')
@Controller('loans')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class LoansController {
  constructor(private readonly loansService: LoansService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new loan application' })
  async create(@Body() createLoanDto: any) {
    return this.loansService.create(createLoanDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all loans' })
  async findAll(@Query() query: any) {
    return this.loansService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get loan by ID' })
  async findOne(@Param('id') id: string) {
    return this.loansService.findOne(id);
  }

  @Put(':id/approve')
  @ApiOperation({ summary: 'Approve a loan' })
  async approve(@Param('id') id: string) {
    return this.loansService.approve(id);
  }
}

