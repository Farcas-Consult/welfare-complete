import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Claim } from './entities/claim.entity';

@Injectable()
export class ClaimsService {
  constructor(
    @InjectRepository(Claim)
    private claimRepository: Repository<Claim>,
  ) {}

  async create(createClaimDto: any) {
    const claimNo = await this.generateClaimNo();
    const claim = this.claimRepository.create({
      ...createClaimDto,
      claimNo,
    });

    const savedClaim = await this.claimRepository.save(claim);
    return {
      message: 'Claim created successfully',
      data: savedClaim,
    };
  }

  async findAll(query: any) {
    const { page = 1, limit = 10, status, memberId } = query;
    const skip = (page - 1) * limit;

    const queryBuilder = this.claimRepository.createQueryBuilder('claim');

    if (status) {
      queryBuilder.where('claim.status = :status', { status });
    }

    if (memberId) {
      queryBuilder.andWhere('claim.memberId = :memberId', { memberId });
    }

    const [claims, total] = await queryBuilder
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    return {
      message: 'Claims retrieved successfully',
      data: {
        claims,
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
    const claim = await this.claimRepository.findOne({
      where: { id },
      relations: ['member', 'beneficiary', 'documents', 'approvals'],
    });

    if (!claim) {
      throw new NotFoundException('Claim not found');
    }

    return {
      message: 'Claim retrieved successfully',
      data: claim,
    };
  }

  async approve(id: string, approveDto: any) {
    const claim = await this.claimRepository.findOne({ where: { id } });

    if (!claim) {
      throw new NotFoundException('Claim not found');
    }

    claim.status = 'approved';
    claim.amountApproved = approveDto.amount || claim.amountRequested;
    claim.approvedBy = approveDto.approverId;

    const updatedClaim = await this.claimRepository.save(claim);

    return {
      message: 'Claim approved successfully',
      data: updatedClaim,
    };
  }

  private async generateClaimNo(): Promise<string> {
    const year = new Date().getFullYear();
    const yearPrefix = String(year);
    
    const count = await this.claimRepository
      .createQueryBuilder('claim')
      .where('claim.claimNo LIKE :prefix', { prefix: `CLM-${yearPrefix}%` })
      .getCount();

    return `CLM-${yearPrefix}${String(count + 1).padStart(4, '0')}`;
  }
}

