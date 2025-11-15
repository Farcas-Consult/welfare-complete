import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Loan } from './loan.entity';
import { Member } from '../../members/entities/member.entity';

@Entity('loan_guarantors')
export class LoanGuarantor extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'loan_id', type: 'uuid' })
  loanId: string;

  @ManyToOne(() => Loan, loan => loan.guarantors, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'loan_id' })
  loan: Loan;

  @Column({ name: 'guarantor_member_id', type: 'uuid' })
  guarantorMemberId: string;

  @ManyToOne(() => Member)
  @JoinColumn({ name: 'guarantor_member_id' })
  guarantor: Member;

  @Column({ name: 'guarantee_amount', type: 'decimal', precision: 10, scale: 2 })
  guaranteeAmount: number;

  @Column({ default: false })
  accepted: boolean;

  @Column({ name: 'accepted_at', type: 'timestamp', nullable: true })
  acceptedAt: Date;

  @Column({ name: 'rejection_reason', type: 'text', nullable: true })
  rejectionReason: string;

  @Column({ type: 'text', nullable: true })
  comments: string;
}
