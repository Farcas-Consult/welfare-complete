import { Controller, Get, Post, Put, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ClaimsService } from './claims.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Claims')
@Controller('claims')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ClaimsController {
  constructor(private readonly claimsService: ClaimsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new claim' })
  async create(@Body() createClaimDto: any) {
    return this.claimsService.create(createClaimDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all claims' })
  async findAll(@Query() query: any) {
    return this.claimsService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get claim by ID' })
  async findOne(@Param('id') id: string) {
    return this.claimsService.findOne(id);
  }

  @Put(':id/approve')
  @ApiOperation({ summary: 'Approve a claim' })
  async approve(@Param('id') id: string, @Body() approveDto: any) {
    return this.claimsService.approve(id, approveDto);
  }
}

