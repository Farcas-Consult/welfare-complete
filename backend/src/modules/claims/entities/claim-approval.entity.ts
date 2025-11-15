import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Claim } from './claim.entity';
import { User } from '../../auth/entities/user.entity';

@Entity('claim_approvals')
export class ClaimApproval extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'claim_id', type: 'uuid' })
  claimId: string;

  @ManyToOne(() => Claim, claim => claim.approvals, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'claim_id' })
  claim: Claim;

  @Column({ name: 'approver_id', type: 'uuid', nullable: true })
  approverId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'approver_id' })
  approver: User;

  @Column({ name: 'approval_level' })
  approvalLevel: number;

  @Column({ length: 20 })
  decision: string; // e.g., 'approved', 'rejected', 'pending'

  @Column({ name: 'amount_approved', type: 'decimal', precision: 10, scale: 2, nullable: true })
  amountApproved: number;

  @Column({ type: 'text', nullable: true })
  comments: string;

  @Column({ name: 'decided_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  decidedAt: Date;
}
