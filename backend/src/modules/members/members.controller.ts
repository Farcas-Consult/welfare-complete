import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { MembersService } from './members.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
import { CreateDependentDto } from './dto/create-dependent.dto';

@ApiTags('Members')
@Controller('members')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class MembersController {
  constructor(private readonly membersService: MembersService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new member' })
  @ApiResponse({ status: 201, description: 'Member created successfully' })
  async create(@Body() createMemberDto: CreateMemberDto) {
    return this.membersService.create(createMemberDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all members' })
  @ApiResponse({ status: 200, description: 'Members retrieved successfully' })
  async findAll(@Query() query: any) {
    return this.membersService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a member by ID' })
  @ApiResponse({ status: 200, description: 'Member retrieved successfully' })
  async findOne(@Param('id') id: string) {
    return this.membersService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a member' })
  @ApiResponse({ status: 200, description: 'Member updated successfully' })
  async update(@Param('id') id: string, @Body() updateMemberDto: UpdateMemberDto) {
    return this.membersService.update(id, updateMemberDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a member' })
  @ApiResponse({ status: 200, description: 'Member deleted successfully' })
  async remove(@Param('id') id: string) {
    return this.membersService.remove(id);
  }

  @Post(':id/dependents')
  @ApiOperation({ summary: 'Add a dependent to a member' })
  @ApiResponse({ status: 201, description: 'Dependent added successfully' })
  async addDependent(@Param('id') id: string, @Body() createDependentDto: CreateDependentDto) {
    return this.membersService.addDependent(id, createDependentDto);
  }

  @Get(':id/dependents')
  @ApiOperation({ summary: 'Get all dependents of a member' })
  @ApiResponse({ status: 200, description: 'Dependents retrieved successfully' })
  async getDependents(@Param('id') id: string) {
    return this.membersService.getDependents(id);
  }
}

