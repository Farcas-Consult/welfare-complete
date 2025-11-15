import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';
import { BaseEntity } from '../../../common/entities/base.entity';

@Entity('refresh_tokens')
export class RefreshToken extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id', type: 'uuid' })
  userId: string;

  @ManyToOne(() => User, user => user.refreshTokens)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'text' })
  token: string;

  @Column({ name: 'expires_at', type: 'timestamp' })
  expiresAt: Date;
}
