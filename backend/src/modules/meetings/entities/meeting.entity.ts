import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { User } from '../../auth/entities/user.entity';

@Entity('meetings')
export class Meeting extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 200 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ name: 'meeting_date', type: 'timestamp' })
  meetingDate: Date;

  @Column({ name: 'meeting_type', length: 50 })
  meetingType: string;

  @Column({
    type: 'enum',
    enum: ['scheduled', 'in_progress', 'completed', 'cancelled'],
    default: 'scheduled',
  })
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';

  @Column({ name: 'location', length: 255, nullable: true })
  location: string;

  @Column({ name: 'zoom_link', type: 'text', nullable: true })
  zoomLink: string;

  @Column({ name: 'created_by', type: 'uuid' })
  createdBy: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'created_by' })
  creator: User;

  @Column({ type: 'jsonb', default: [] })
  attendees: string[];

  @Column({ type: 'jsonb', default: {} })
  metadata: Record<string, any>;
}

