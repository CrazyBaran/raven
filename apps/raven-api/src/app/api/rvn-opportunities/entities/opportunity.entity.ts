import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  Index,
  AfterInsert,
  AfterLoad,
} from 'typeorm';
import { Organisation } from './organisation.entity';

@Entity({ name: 'opportunities' })
@Index(['id'], { unique: true })
export class Opportunity {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @ManyToOne(() => Organisation, (organisation) => organisation.id)
  @Column()
  public organisationId: number;

  @AfterInsert()
  @AfterLoad()
  public lifecycleUuidLowerCase(): void {
    this.id = this.id.toLowerCase();
  }
}
