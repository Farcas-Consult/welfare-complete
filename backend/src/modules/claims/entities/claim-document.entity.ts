import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Claim } from './claim.entity';
import { User } from '../../auth/entities/user.entity';

@Entity('claim_documents')
export class ClaimDocument extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'claim_id', type: 'uuid' })
  claimId: string;

  @ManyToOne(() => Claim, claim => claim.documents, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'claim_id' })
  claim: Claim;

  @Column({ name: 'document_type', length: 50 })
  documentType: string;

  @Column({ name: 'document_name', length: 255 })
  documentName: string;

  @Column({ name: 'file_url', type: 'text' })
  fileUrl: string;

  @Column({ name: 'uploaded_by', type: 'uuid', nullable: true })
  uploadedBy: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'uploaded_by' })
  uploadedByUser: User;

  @Column({ name: 'uploaded_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  uploadedAt: Date;

  @Column({ default: false })
  verified: boolean;
}
