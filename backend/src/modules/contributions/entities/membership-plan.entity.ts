import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';

@Entity('membership_plans')
export class MembershipPlan extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  name: string;

  @Column({ length: 20, unique: true })
  code: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ name: 'monthly_contribution', type: 'decimal', precision: 10, scale: 2 })
  monthlyContribution: number;

  @Column({ name: 'registration_fee', type: 'decimal', precision: 10, scale: 2, default: 0 })
  registrationFee: number;

  @Column({ type: 'jsonb', default: {} })
  benefits: Record<string, any>;

  @Column({ name: 'max_loan_multiple', default: 3 })
  maxLoanMultiple: number;

  @Column({ name: 'min_contribution_months', default: 6 })
  minContributionMonths: number;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;
}
