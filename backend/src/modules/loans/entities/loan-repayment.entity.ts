import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Loan } from './loan.entity';
import { Payment } from '../../payments/entities/payment.entity';

@Entity('loan_repayments')
export class LoanRepayment extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'loan_id', type: 'uuid' })
  loanId: string;

  @ManyToOne(() => Loan, loan => loan.repayments, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'loan_id' })
  loan: Loan;

  @Column({ name: 'payment_id', type: 'uuid', nullable: true })
  paymentId: string;

  @ManyToOne(() => Payment)
  @JoinColumn({ name: 'payment_id' })
  payment: Payment;

  @Column({ name: 'installment_no' })
  installmentNo: number;

  @Column({ name: 'due_date', type: 'date' })
  dueDate: Date;

  @Column({ name: 'amount_due', type: 'decimal', precision: 10, scale: 2 })
  amountDue: number;

  @Column({ name: 'amount_paid', type: 'decimal', precision: 10, scale: 2, default: 0 })
  amountPaid: number;

  @Column({ name: 'paid_date', type: 'date', nullable: true })
  paidDate: Date;

  @Column({
    type: 'enum',
    enum: ['pending', 'paid', 'failed', 'refunded', 'cancelled'],
    default: 'pending',
  })
  status: 'pending' | 'paid' | 'failed' | 'refunded' | 'cancelled';

  @Column({ name: 'penalties', type: 'decimal', precision: 10, scale: 2, default: 0 })
  penalties: number;
}
