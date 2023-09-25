import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { HttpMethodEnum } from '../../../shared/enum/http-method.enum';
import { ActionTypeEnum } from '../enums/action-type.enum';

@Entity({ name: 'audit_logs' })
export class AuditLogEntity {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public user: string;

  @Column()
  public module: string;

  @Column({ type: 'varchar' })
  public actionType: ActionTypeEnum;

  @Column()
  public actionResult: number;

  /**
   * min of max query length in browsers (for IE is 2083)
   */
  @Column({ type: 'nvarchar', length: '2083', nullable: true, default: null })
  public query: string;

  @Column({ type: 'nvarchar', length: 'MAX', nullable: true, default: null })
  public body: unknown;

  @Column({ type: 'varchar' })
  public httpMethod: HttpMethodEnum;

  @Column()
  public controller: string;

  @CreateDateColumn()
  @Index()
  public createdAt: Date;

  @BeforeInsert()
  public lifecycleBodyStringify(): void {
    if (typeof this.body !== 'undefined') {
      this.body = JSON.stringify(this.body);
    }
  }
}
