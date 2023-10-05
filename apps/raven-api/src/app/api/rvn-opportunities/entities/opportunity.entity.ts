import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  Index,
  AfterInsert,
  AfterLoad,
  JoinColumn,
  RelationId,
} from 'typeorm';
import { OrganisationEntity } from './organisation.entity';

@Entity({ name: 'opportunities' })
@Index(['id'], { unique: true })
export class OpportunityEntity {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @ManyToOne(() => OrganisationEntity, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id' })
  public organisation: OrganisationEntity;

  @Column()
  @RelationId((opportunity: OpportunityEntity) => opportunity.organisation)
  public organisationId: string;

  @AfterInsert()
  @AfterLoad()
  public lifecycleUuidLowerCase(): void {
    this.id = this.id.toLowerCase();
  }
}
