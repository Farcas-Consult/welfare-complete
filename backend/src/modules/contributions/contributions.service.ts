import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Invoice } from './entities/invoice.entity';
import { MembershipPlan } from './entities/membership-plan.entity';

@Injectable()
export class ContributionsService {
  constructor(
    @InjectRepository(Invoice)
    private invoiceRepository: Repository<Invoice>,
    @InjectRepository(MembershipPlan)
    private planRepository: Repository<MembershipPlan>,
  ) {}

  async getInvoices(query: any) {
    const { page = 1, limit = 10, memberId, status } = query;
    const skip = (page - 1) * limit;

    const queryBuilder = this.invoiceRepository.createQueryBuilder('invoice');

    if (memberId) {
      queryBuilder.where('invoice.memberId = :memberId', { memberId });
    }

    if (status) {
      queryBuilder.andWhere('invoice.status = :status', { status });
    }

    const [invoices, total] = await queryBuilder
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    return {
      message: 'Invoices retrieved successfully',
      data: {
        invoices,
        pagination: {
          total,
          page: Number(page),
          limit: Number(limit),
          totalPages: Math.ceil(total / limit),
        },
      },
    };
  }

  async getInvoice(id: string) {
    const invoice = await this.invoiceRepository.findOne({
      where: { id },
      relations: ['member', 'payments'],
    });

    if (!invoice) {
      throw new NotFoundException('Invoice not found');
    }

    return {
      message: 'Invoice retrieved successfully',
      data: invoice,
    };
  }

  async getPlans() {
    const plans = await this.planRepository.find({
      where: { isActive: true },
    });

    return {
      message: 'Membership plans retrieved successfully',
      data: plans,
    };
  }
}

