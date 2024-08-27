import { plainToInstance } from 'class-transformer';
import {
  AfterInsert,
  AfterLoad,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';
import { TagEntity } from '../../rvn-tags/entities/tag.entity';
import { FundManagerEntity } from './fund-manager.entity';

@Entity('fund_manager_industry')
export class FundManagerIndustryEntity {
  @PrimaryColumn({ name: 'fund_manager_id' })
  @Index()
  public fundManagerId: string;

  @PrimaryColumn({ name: 'tag_id' })
  @Index()
  public tagId: string;

  @ManyToOne(() => FundManagerEntity, (manager) => manager.industryTags, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'fund_manager_id', referencedColumnName: 'id' }])
  public fundManagers: FundManagerEntity[];

  @ManyToOne(() => TagEntity, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'tag_id', referencedColumnName: 'id' }])
  public tags: TagEntity[];

  public static create(
    partial: Partial<FundManagerIndustryEntity>,
  ): FundManagerIndustryEntity {
    return plainToInstance(FundManagerIndustryEntity, partial);
  }

  @AfterInsert()
  @AfterLoad()
  public lifecycleUuidLowerCase(): void {
    this.fundManagerId = this.fundManagerId?.toLowerCase();
    this.tagId = this.tagId?.toLowerCase();
  }
}
