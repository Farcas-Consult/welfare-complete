import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Member } from './member.entity';

@Entity('dependents')
export class Dependent extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'member_id', type: 'uuid' })
  memberId: string;

  @ManyToOne(() => Member, member => member.dependents, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'member_id' })
  member: Member;

  @Column({ name: 'first_name', length: 100 })
  firstName: string;

  @Column({ name: 'last_name', length: 100 })
  lastName: string;

  @Column({ length: 50 })
  relationship: string;

  @Column({ name: 'date_of_birth', type: 'date', nullable: true })
  dateOfBirth: Date;

  @Column({ name: 'national_id', length: 50, nullable: true })
  nationalId: string;

  @Column({ length: 20, nullable: true })
  phone: string;

  @Column({ name: 'is_beneficiary', default: false })
  isBeneficiary: boolean;

  @Column({ name: 'benefit_percentage', type: 'decimal', precision: 5, scale: 2, nullable: true })
  benefitPercentage: number;
}
