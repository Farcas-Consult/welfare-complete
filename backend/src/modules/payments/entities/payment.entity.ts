import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Member } from '../../members/entities/member.entity';
import { Invoice } from '../../contributions/entities/invoice.entity';

@Entity('payments')
export class Payment extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'payment_ref', length: 100, unique: true })
  paymentRef: string;

  @Column({ name: 'invoice_id', type: 'uuid', nullable: true })
  invoiceId: string;

  @ManyToOne(() => Invoice, invoice => invoice.payments)
  @JoinColumn({ name: 'invoice_id' })
  invoice: Invoice;

  @Column({ name: 'member_id', type: 'uuid' })
  memberId: string;

  @ManyToOne(() => Member, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'member_id' })
  member: Member;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({ name: 'payment_method', length: 50 })
  paymentMethod: string;

  @Column({ length: 50, nullable: true })
  channel: string;

  @Column({ name: 'channel_ref', length: 255, nullable: true })
  channelRef: string;

  @Column({
    type: 'enum',
    enum: ['pending', 'paid', 'failed', 'refunded', 'cancelled'],
    default: 'pending',
  })
  status: 'pending' | 'paid' | 'failed' | 'refunded' | 'cancelled';

  @Column({ name: 'paid_at', type: 'timestamp', nullable: true })
  paidAt: Date;

  @Column({ default: false })
  reconciled: boolean;

  @Column({ name: 'reconciled_at', type: 'timestamp', nullable: true })
  reconciledAt: Date;

  @Column({ name: 'receipt_no', length: 50, nullable: true })
  receiptNo: string;

  @Column({ name: 'raw_payload', type: 'jsonb', nullable: true })
  rawPayload: Record<string, any>;
}
