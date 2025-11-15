import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditLog } from './entities/audit-log.entity';

@Injectable()
export class AuditService {
  constructor(
    @InjectRepository(AuditLog)
    private auditLogRepository: Repository<AuditLog>,
  ) {}

  async getLogs(query: any) {
    const { page = 1, limit = 10, userId, action } = query;
    const skip = (page - 1) * limit;

    const queryBuilder = this.auditLogRepository.createQueryBuilder('audit');

    if (userId) {
      queryBuilder.where('audit.userId = :userId', { userId });
    }

    if (action) {
      queryBuilder.andWhere('audit.action = :action', { action });
    }

    const [logs, total] = await queryBuilder
      .orderBy('audit.createdAt', 'DESC')
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    return {
      message: 'Audit logs retrieved successfully',
      data: {
        logs,
        pagination: {
          total,
          page: Number(page),
          limit: Number(limit),
          totalPages: Math.ceil(total / limit),
        },
      },
    };
  }
}

