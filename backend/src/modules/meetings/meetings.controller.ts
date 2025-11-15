import { Controller, Get, Post, Put, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { MeetingsService } from './meetings.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Meetings')
@Controller('meetings')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class MeetingsController {
  constructor(private readonly meetingsService: MeetingsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new meeting' })
  async create(@Body() createMeetingDto: any) {
    return this.meetingsService.create(createMeetingDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all meetings' })
  async findAll(@Query() query: any) {
    return this.meetingsService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get meeting by ID' })
  async findOne(@Param('id') id: string) {
    return this.meetingsService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a meeting' })
  async update(@Param('id') id: string, @Body() updateMeetingDto: any) {
    return this.meetingsService.update(id, updateMeetingDto);
  }
}

