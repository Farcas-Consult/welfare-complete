import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { Member } from '../../members/entities/member.entity';
import { RefreshToken } from './refresh-token.entity';
import { BaseEntity } from '../../../common/entities/base.entity';

@Entity('users')
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'member_id', type: 'uuid', nullable: true })
  memberId: string;

  @OneToOne(() => Member, member => member.user)
  @JoinColumn({ name: 'member_id' })
  member: Member;

  @Column({ unique: true })
  username: string;

  @Column({ unique: true })
  email: string;

  @Column({ name: 'password_hash' })
  passwordHash: string;

  @Column({
    type: 'enum',
    enum: ['member', 'treasurer', 'secretary', 'committee', 'admin', 'auditor'],
    default: 'member',
  })
  role: 'member' | 'treasurer' | 'secretary' | 'committee' | 'admin' | 'auditor';

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @Column({ name: 'mfa_enabled', default: false })
  mfaEnabled: boolean;

  @Column({ name: 'mfa_secret', nullable: true })
  mfaSecret: string;

  @Column({ name: 'last_login', type: 'timestamp', nullable: true })
  lastLogin: Date;

  @Column({ name: 'login_attempts', default: 0 })
  loginAttempts: number;

  @Column({ name: 'locked_until', type: 'timestamp', nullable: true })
  lockedUntil: Date;

  @Column({ name: 'password_reset_token', nullable: true })
  passwordResetToken: string;

  @Column({ name: 'password_reset_expires', type: 'timestamp', nullable: true })
  passwordResetExpires: Date;

  @Column({ name: 'email_verified', default: false })
  emailVerified: boolean;

  @Column({ name: 'email_verification_token', nullable: true })
  emailVerificationToken: string;

  @OneToMany(() => RefreshToken, refreshToken => refreshToken.user)
  refreshTokens: RefreshToken[];
}
