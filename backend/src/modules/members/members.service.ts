import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Member } from './entities/member.entity';
import { Dependent } from './entities/dependent.entity';
import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
import { CreateDependentDto } from './dto/create-dependent.dto';

@Injectable()
export class MembersService {
  constructor(
    @InjectRepository(Member)
    private memberRepository: Repository<Member>,
    @InjectRepository(Dependent)
    private dependentRepository: Repository<Dependent>,
  ) {}

  async create(createMemberDto: CreateMemberDto) {
    // Generate member number
    const memberNo = await this.generateMemberNo();

    const member = this.memberRepository.create({
      ...createMemberDto,
      memberNo,
    });

    const savedMember = await this.memberRepository.save(member);

    return {
      message: 'Member created successfully',
      data: savedMember,
    };
  }

  async findAll(query: any) {
    const { page = 1, limit = 10, status, search } = query;
    const skip = (page - 1) * limit;

    const queryBuilder = this.memberRepository.createQueryBuilder('member');

    if (status) {
      queryBuilder.where('member.status = :status', { status });
    }

    if (search) {
      queryBuilder.andWhere(
        '(member.firstName ILIKE :search OR member.lastName ILIKE :search OR member.memberNo ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    const [members, total] = await queryBuilder
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    return {
      message: 'Members retrieved successfully',
      data: {
        members,
        pagination: {
          total,
          page: Number(page),
          limit: Number(limit),
          totalPages: Math.ceil(total / limit),
        },
      },
    };
  }

  async findOne(id: string) {
    const member = await this.memberRepository.findOne({
      where: { id },
      relations: ['dependents', 'user'],
    });

    if (!member) {
      throw new NotFoundException('Member not found');
    }

    return {
      message: 'Member retrieved successfully',
      data: member,
    };
  }

  async update(id: string, updateMemberDto: UpdateMemberDto) {
    const member = await this.memberRepository.findOne({ where: { id } });

    if (!member) {
      throw new NotFoundException('Member not found');
    }

    Object.assign(member, updateMemberDto);
    const updatedMember = await this.memberRepository.save(member);

    return {
      message: 'Member updated successfully',
      data: updatedMember,
    };
  }

  async remove(id: string) {
    const member = await this.memberRepository.findOne({ where: { id } });

    if (!member) {
      throw new NotFoundException('Member not found');
    }

    await this.memberRepository.remove(member);

    return {
      message: 'Member deleted successfully',
    };
  }

  async addDependent(memberId: string, createDependentDto: CreateDependentDto) {
    const member = await this.memberRepository.findOne({ where: { id: memberId } });

    if (!member) {
      throw new NotFoundException('Member not found');
    }

    const dependent = this.dependentRepository.create({
      ...createDependentDto,
      memberId,
    });

    const savedDependent = await this.dependentRepository.save(dependent);

    return {
      message: 'Dependent added successfully',
      data: savedDependent,
    };
  }

  async getDependents(memberId: string) {
    const member = await this.memberRepository.findOne({
      where: { id: memberId },
      relations: ['dependents'],
    });

    if (!member) {
      throw new NotFoundException('Member not found');
    }

    return {
      message: 'Dependents retrieved successfully',
      data: member.dependents,
    };
  }

  private async generateMemberNo(): Promise<string> {
    const year = new Date().getFullYear();
    const yearPrefix = String(year);
    
    const count = await this.memberRepository
      .createQueryBuilder('member')
      .where('member.memberNo LIKE :prefix', { prefix: `${yearPrefix}%` })
      .getCount();

    return `${yearPrefix}${String(count + 1).padStart(4, '0')}`;
  }
}

