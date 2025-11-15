import { Entity, PrimaryGeneratedColumn, Column, OneToMany, OneToOne } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { User } from '../../auth/entities/user.entity';
import { Dependent } from './dependent.entity';
import { Invoice } from '../../contributions/entities/invoice.entity';

@Entity('members')
export class Member extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'member_no', unique: true, length: 50 })
  memberNo: string;

  @Column({ name: 'first_name', length: 100 })
  firstName: string;

  @Column({ name: 'last_name', length: 100 })
  lastName: string;

  @Column({ name: 'middle_name', length: 100, nullable: true })
  middleName: string;

  @Column({ name: 'national_id', length: 50, unique: true, nullable: true })
  nationalId: string;

  @Column({ name: 'phone_primary', length: 20 })
  phonePrimary: string;

  @Column({ length: 255, unique: true, nullable: true })
  email: string;

  @Column({ name: 'date_of_birth', type: 'date', nullable: true })
  dateOfBirth: Date;

  @Column({ length: 10, nullable: true })
  gender: string;

  @Column({
    type: 'enum',
    enum: ['active', 'inactive', 'suspended', 'deceased'],
    default: 'active',
  })
  status: 'active' | 'inactive' | 'suspended' | 'deceased';

  @Column({ name: 'plan_id', type: 'uuid', nullable: true })
  planId: string;

  @Column({ name: 'kyc_status', default: false })
  kycStatus: boolean;

  @Column({ type: 'jsonb', default: {} })
  metadata: Record<string, any>;

  @OneToOne(() => User, user => user.member)
  user: User;

  @OneToMany(() => Dependent, dependent => dependent.member)
  dependents: Dependent[];

  @OneToMany(() => Invoice, invoice => invoice.member)
  invoices: Invoice[];
}
