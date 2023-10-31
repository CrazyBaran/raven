import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'cca_token_caches' })
export class CcaTokenCacheEntity {
  @PrimaryColumn({ type: 'nvarchar', length: '256', nullable: false })
  public key: string;

  @Column({ type: 'nvarchar', length: 'max', nullable: false })
  public value: string;

  @Column({ default: false, nullable: false })
  public isEncrypted: boolean;

  @CreateDateColumn()
  public createdAt: Date;

  @UpdateDateColumn({ nullable: true })
  public updatedAt: Date;
}
