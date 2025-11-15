import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { User } from '../../auth/entities/user.entity';

@Entity('notifications')
export class Notification extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id', type: 'uuid', nullable: true })
  userId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ length: 200 })
  title: string;

  @Column({ type: 'text' })
  message: string;

  @Column({
    name: 'channel',
    type: 'enum',
    enum: ['email', 'sms', 'whatsapp', 'in_app'],
    default: 'in_app',
  })
  channel: 'email' | 'sms' | 'whatsapp' | 'in_app';

  @Column({ name: 'is_read', default: false })
  isRead: boolean;

  @Column({ name: 'read_at', type: 'timestamp', nullable: true })
  readAt: Date;

  @Column({ name: 'notification_type', length: 50 })
  notificationType: string;

  @Column({ type: 'jsonb', default: {} })
  metadata: Record<string, any>;
}

