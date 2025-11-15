import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Member } from '../../members/entities/member.entity';
import { LoanProduct } from './loan-product.entity';
import { User } from '../../auth/entities/user.entity';
import { LoanGuarantor } from './loan-guarantor.entity';
import { LoanRepayment } from './loan-repayment.entity';

@Entity('loans')
export class Loan extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'loan_no', length: 50, unique: true })
  loanNo: string;

  @Column({ name: 'member_id', type: 'uuid' })
  memberId: string;

  @ManyToOne(() => Member, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'member_id' })
  member: Member;

  @Column({ name: 'product_id', type: 'uuid', nullable: true })
  productId: string;

  @ManyToOne(() => LoanProduct)
  @JoinColumn({ name: 'product_id' })
  product: LoanProduct;

  @Column({ name: 'principal_amount', type: 'decimal', precision: 10, scale: 2 })
  principalAmount: number;

  @Column({ name: 'service_fee', type: 'decimal', precision: 10, scale: 2 })
  serviceFee: number;

  @Column({ name: 'total_amount', type: 'decimal', precision: 10, scale: 2 })
  totalAmount: number;

  @Column({ name: 'tenure_months' })
  tenureMonths: number;

  @Column({ name: 'monthly_installment', type: 'decimal', precision: 10, scale: 2 })
  monthlyInstallment: number;

  @Column({ type: 'text', nullable: true })
  purpose: string;

  @Column({
    type: 'enum',
    enum: ['application', 'approved', 'disbursed', 'active', 'completed', 'defaulted', 'written_off'],
    default: 'application',
  })
  status: 'application' | 'approved' | 'disbursed' | 'active' | 'completed' | 'defaulted' | 'written_off';

  @Column({ name: 'application_date', type: 'date', default: () => 'CURRENT_DATE' })
  applicationDate: Date;

  @Column({ name: 'disbursed_date', type: 'date', nullable: true })
  disbursedDate: Date;

  @Column({ name: 'outstanding_balance', type: 'decimal', precision: 10, scale: 2, nullable: true })
  outstandingBalance: number;

  @Column({ name: 'total_paid', type: 'decimal', precision: 10, scale: 2, default: 0 })
  totalPaid: number;

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

  @OneToMany(() => LoanGuarantor, guarantor => guarantor.loan)
  guarantors: LoanGuarantor[];

  @OneToMany(() => LoanRepayment, repayment => repayment.loan)
  repayments: LoanRepayment[];
}
