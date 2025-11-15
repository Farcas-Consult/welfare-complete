import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment } from './entities/payment.entity';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment)
    private paymentRepository: Repository<Payment>,
  ) {}

  async create(createPaymentDto: any) {
    const paymentRef = `PAY-${uuidv4().substring(0, 8).toUpperCase()}`;
    const payment = this.paymentRepository.create({
      ...createPaymentDto,
      paymentRef,
    });

    const savedPayment = await this.paymentRepository.save(payment);
    return {
      message: 'Payment created successfully',
      data: savedPayment,
    };
  }

  async findAll(query: any) {
    const { page = 1, limit = 10, memberId, status } = query;
    const skip = (page - 1) * limit;

    const queryBuilder = this.paymentRepository.createQueryBuilder('payment');

    if (memberId) {
      queryBuilder.where('payment.memberId = :memberId', { memberId });
    }

    if (status) {
      queryBuilder.andWhere('payment.status = :status', { status });
    }

    const [payments, total] = await queryBuilder
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    return {
      message: 'Payments retrieved successfully',
      data: {
        payments,
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
    const payment = await this.paymentRepository.findOne({
      where: { id },
      relations: ['member', 'invoice'],
    });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    return {
      message: 'Payment retrieved successfully',
      data: payment,
    };
  }
}

