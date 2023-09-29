import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index,
  AfterInsert,
  AfterLoad,
} from 'typeorm';

@Entity('affinity_organisations')
@Index(['id'], { unique: true })
export class AffinityOrganisation {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column()
  public name: string;

  @Column()
  public internalId: number;

  @AfterInsert()
  @AfterLoad()
  public lifecycleUuidLowerCase(): void {
    this.id = this.id.toLowerCase();
  }
}
