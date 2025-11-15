import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Member } from '../../members/entities/member.entity';
import { Payment } from '../../payments/entities/payment.entity';

@Entity('invoices')
export class Invoice extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'invoice_no', length: 50, unique: true })
  invoiceNo: string;

  @Column({ name: 'member_id', type: 'uuid' })
  memberId: string;

  @ManyToOne(() => Member, member => member.invoices, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'member_id' })
  member: Member;

  @Column({ name: 'period_year' })
  periodYear: number;

  @Column({ name: 'period_month' })
  periodMonth: number;

  @Column({ name: 'amount_due', type: 'decimal', precision: 10, scale: 2 })
  amountDue: number;

  @Column({ name: 'due_date', type: 'date' })
  dueDate: Date;

  @Column({
    type: 'enum',
    enum: ['pending', 'paid', 'failed', 'refunded', 'cancelled'],
    default: 'pending',
  })
  status: 'pending' | 'paid' | 'failed' | 'refunded' | 'cancelled';

  @Column({ name: 'paid_amount', type: 'decimal', precision: 10, scale: 2, default: 0 })
  paidAmount: number;

  @Column({ name: 'balance', type: 'decimal', precision: 10, scale: 2, nullable: true })
  balance: number;

  @Column({ name: 'late_fee', type: 'decimal', precision: 10, scale: 2, default: 0 })
  lateFee: number;

  @Column({ type: 'jsonb', default: {} })
  metadata: Record<string, any>;

  @OneToMany(() => Payment, payment => payment.invoice)
  payments: Payment[];
}
