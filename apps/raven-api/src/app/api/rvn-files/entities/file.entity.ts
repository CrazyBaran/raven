import {
  AfterInsert,
  AfterLoad,
  Column,
  Entity,
  Index,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { OpportunityEntity } from '../../rvn-opportunities/entities/opportunity.entity';
import { TagEntity } from '../../rvn-tags/entities/tag.entity';

@Entity({ name: 'files' })
@Index(['id', 'name'], { unique: true })
export class FileEntity {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column()
  public name: string;

  @Column()
  public path: string;

  @Column()
  public internalSharepointId: string;

  @ManyToOne(() => OpportunityEntity, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'opportunity_id' })
  public opportunity: OpportunityEntity;

  @Column()
  public opportunityId: string;

  @ManyToMany(() => TagEntity)
  @JoinTable({
    name: 'file_tags',
    joinColumn: { name: 'file_id' },
    inverseJoinColumn: { name: 'tag_id' },
  })
  public tags: TagEntity[];

  @AfterInsert()
  @AfterLoad()
  public lifecycleUuidLowerCase(): void {
    this.id = this.id.toLowerCase();
    this.opportunityId = this.opportunityId.toLowerCase();
  }
}
