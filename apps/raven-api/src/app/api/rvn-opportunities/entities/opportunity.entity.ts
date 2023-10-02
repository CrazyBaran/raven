import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  Index,
  AfterInsert,
  AfterLoad,
} from 'typeorm';
import { OrganisationEntity } from './organisation.entity';

@Entity({ name: 'opportunities' })
@Index(['id'], { unique: true })
export class OpportunityEntity {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @ManyToOne(() => OrganisationEntity, (organisation) => organisation.id)
  @Column()
  public organisationId: number;

  @AfterInsert()
  @AfterLoad()
  public lifecycleUuidLowerCase(): void {
    this.id = this.id.toLowerCase();
  }
}
