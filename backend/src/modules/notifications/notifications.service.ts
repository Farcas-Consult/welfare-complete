import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from './entities/notification.entity';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>,
  ) {}

  async findAll(userId: string, query: any) {
    const { page = 1, limit = 10, isRead } = query;
    const skip = (page - 1) * limit;

    const queryBuilder = this.notificationRepository.createQueryBuilder('notification')
      .where('notification.userId = :userId', { userId });

    if (isRead !== undefined) {
      queryBuilder.andWhere('notification.isRead = :isRead', { isRead: isRead === 'true' });
    }

    const [notifications, total] = await queryBuilder
      .orderBy('notification.createdAt', 'DESC')
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    return {
      message: 'Notifications retrieved successfully',
      data: {
        notifications,
        pagination: {
          total,
          page: Number(page),
          limit: Number(limit),
          totalPages: Math.ceil(total / limit),
        },
      },
    };
  }

  async markAsRead(id: string) {
    const notification = await this.notificationRepository.findOne({ where: { id } });

    if (!notification) {
      throw new NotFoundException('Notification not found');
    }

    notification.isRead = true;
    notification.readAt = new Date();
    await this.notificationRepository.save(notification);

    return {
      message: 'Notification marked as read',
    };
  }
}

