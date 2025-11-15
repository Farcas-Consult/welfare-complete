import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Member } from '../../members/entities/member.entity';
import { Dependent } from '../../members/entities/dependent.entity';
import { User } from '../../auth/entities/user.entity';
import { ClaimDocument } from './claim-document.entity';
import { ClaimApproval } from './claim-approval.entity';

@Entity('claims')
export class Claim extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'claim_no', length: 50, unique: true })
  claimNo: string;

  @Column({ name: 'member_id', type: 'uuid' })
  memberId: string;

  @ManyToOne(() => Member, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'member_id' })
  member: Member;

  @Column({ name: 'beneficiary_id', type: 'uuid', nullable: true })
  beneficiaryId: string;

  @ManyToOne(() => Dependent)
  @JoinColumn({ name: 'beneficiary_id' })
  beneficiary: Dependent;

  @Column({
    name: 'claim_type',
    type: 'enum',
    enum: ['bereavement', 'medical', 'emergency'],
  })
  claimType: 'bereavement' | 'medical' | 'emergency';

  @Column({ name: 'amount_requested', type: 'decimal', precision: 10, scale: 2 })
  amountRequested: number;

  @Column({ name: 'amount_approved', type: 'decimal', precision: 10, scale: 2, nullable: true })
  amountApproved: number;

  @Column({ type: 'text' })
  reason: string;

  @Column({
    type: 'enum',
    enum: ['draft', 'submitted', 'under_review', 'approved', 'rejected', 'disbursed', 'completed'],
    default: 'draft',
  })
  status: 'draft' | 'submitted' | 'under_review' | 'approved' | 'rejected' | 'disbursed' | 'completed';

  @Column({ name: 'submitted_at', type: 'timestamp', nullable: true })
  submittedAt: Date;

  @Column({ name: 'submitted_by', type: 'uuid', nullable: true })
  submittedBy: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'submitted_by' })
  userSubmittedBy: User;

  @Column({ name: 'reviewed_by', type: 'uuid', nullable: true })
  reviewedBy: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'reviewed_by' })
  userReviewedBy: User;

  @Column({ name: 'approved_by', type: 'uuid', nullable: true })
  approvedBy: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'approved_by' })
  userApprovedBy: User;

  @Column({ name: 'disbursed_by', type: 'uuid', nullable: true })
  disbursedBy: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'disbursed_by' })
  userDisbursedBy: User;

  @Column({ name: 'rejection_reason', type: 'text', nullable: true })
  rejectionReason: string;

  @Column({ type: 'jsonb', default: {} })
  metadata: Record<string, any>;

  @OneToMany(() => ClaimDocument, document => document.claim)
  documents: ClaimDocument[];

  @OneToMany(() => ClaimApproval, approval => approval.claim)
  approvals: ClaimApproval[];
}
