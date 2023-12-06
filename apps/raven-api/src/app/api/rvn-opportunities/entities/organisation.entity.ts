import {
  AfterInsert,
  AfterLoad,
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { SharepointEnabledEntity } from '../../../shared/interfaces/sharepoint-enabled-entity.interface';
import { OpportunityEntity } from './opportunity.entity';

@Entity('organisations')
@Index(['id'], { unique: true })
export class OrganisationEntity implements SharepointEnabledEntity {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column()
  public name: string;

  @Column('simple-array')
  public domains: string[];

  @OneToMany(
    (type) => OpportunityEntity,
    (opportunity) => opportunity.organisation,
  )
  public opportunities: OpportunityEntity[];

  @Column({ nullable: true })
  public sharepointDirectoryId: string | null;

  @AfterInsert()
  @AfterLoad()
  public lifecycleUuidLowerCase(): void {
    this.id = this.id.toLowerCase();
  }
}
