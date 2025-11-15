import { PrimaryGeneratedColumn, UpdateDateColumn, CreateDateColumn } from 'typeorm';

/**
 * Abstract Base Entity for TypeORM
 * Provides common columns like id, created_at, and updated_at
 * for most database tables in the system.
 */
export abstract class BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp with time zone',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp with time zone',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;
}
