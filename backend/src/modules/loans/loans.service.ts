import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Loan } from './entities/loan.entity';

@Injectable()
export class LoansService {
  constructor(
    @InjectRepository(Loan)
    private loanRepository: Repository<Loan>,
  ) {}

  async create(createLoanDto: any) {
    const loanNo = await this.generateLoanNo();
    const loan = this.loanRepository.create({
      ...createLoanDto,
      loanNo,
    });

    const savedLoan = await this.loanRepository.save(loan);
    return {
      message: 'Loan application created successfully',
      data: savedLoan,
    };
  }

  async findAll(query: any) {
    const { page = 1, limit = 10, status, memberId } = query;
    const skip = (page - 1) * limit;

    const queryBuilder = this.loanRepository.createQueryBuilder('loan');

    if (status) {
      queryBuilder.where('loan.status = :status', { status });
    }

    if (memberId) {
      queryBuilder.andWhere('loan.memberId = :memberId', { memberId });
    }

    const [loans, total] = await queryBuilder
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    return {
      message: 'Loans retrieved successfully',
      data: {
        loans,
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
    const loan = await this.loanRepository.findOne({
      where: { id },
      relations: ['member', 'product', 'guarantors', 'repayments'],
    });

    if (!loan) {
      throw new NotFoundException('Loan not found');
    }

    return {
      message: 'Loan retrieved successfully',
      data: loan,
    };
  }

  async approve(id: string) {
    const loan = await this.loanRepository.findOne({ where: { id } });

    if (!loan) {
      throw new NotFoundException('Loan not found');
    }

    loan.status = 'approved';
    const updatedLoan = await this.loanRepository.save(loan);

    return {
      message: 'Loan approved successfully',
      data: updatedLoan,
    };
  }

  private async generateLoanNo(): Promise<string> {
    const year = new Date().getFullYear();
    const yearPrefix = String(year);
    
    const count = await this.loanRepository
      .createQueryBuilder('loan')
      .where('loan.loanNo LIKE :prefix', { prefix: `LN-${yearPrefix}%` })
      .getCount();

    return `LN-${yearPrefix}${String(count + 1).padStart(4, '0')}`;
  }
}

