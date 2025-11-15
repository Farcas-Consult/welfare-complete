import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Loan } from './loan.entity';

@Entity('loan_products')
export class LoanProduct extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  name: string;

  @Column({ length: 20, unique: true })
  code: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ name: 'max_amount', type: 'decimal', precision: 10, scale: 2, nullable: true })
  maxAmount: number;

  @Column({ name: 'max_multiple_of_contribution', default: 3 })
  maxMultipleOfContribution: number;

  @Column({ name: 'max_tenure_months', default: 12 })
  maxTenureMonths: number;

  @Column({ name: 'service_fee_percentage', type: 'decimal', precision: 5, scale: 2, default: 5.00 })
  serviceFeePercentage: number;

  @Column({ name: 'requires_guarantors', default: false })
  requiresGuarantors: boolean;

  @Column({ name: 'min_guarantors', default: 0 })
  minGuarantors: number;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @OneToMany(() => Loan, loan => loan.product)
  loans: Loan[];
}
