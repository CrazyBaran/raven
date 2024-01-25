import {
  AfterInsert,
  AfterLoad,
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
  ValueTransformer,
} from 'typeorm';
import { SharepointEnabledEntity } from '../../../shared/interfaces/sharepoint-enabled-entity.interface';
import { OpportunityEntity } from './opportunity.entity';

export class SimpleArrayTransformer implements ValueTransformer {
  public to(value: string[] | string): string {
    if ((value as string[])?.join) {
      return (value as string[])?.join(',');
    }
    return value as string;
  }

  public from(value: string): string[] {
    return value?.split(',');
  }
}

@Entity('organisations')
@Index(['id'], { unique: true })
export class OrganisationEntity implements SharepointEnabledEntity {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column()
  public name: string;

  @Column('nvarchar', {
    nullable: false,
    length: 1024,
    transformer: new SimpleArrayTransformer(),
  })
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
