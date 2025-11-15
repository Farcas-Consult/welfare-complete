import { Controller, Get, Post, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { PaymentsService } from './payments.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Payments')
@Controller('payments')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new payment' })
  async create(@Body() createPaymentDto: any) {
    return this.paymentsService.create(createPaymentDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all payments' })
  async findAll(@Query() query: any) {
    return this.paymentsService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get payment by ID' })
  async findOne(@Param('id') id: string) {
    return this.paymentsService.findOne(id);
  }
}

