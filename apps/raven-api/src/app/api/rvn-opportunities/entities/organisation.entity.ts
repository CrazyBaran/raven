import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index,
  AfterInsert,
  AfterLoad,
} from 'typeorm';

@Entity('organisations')
@Index(['id'], { unique: true })
export class Organisation {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column()
  public name: string;

  @AfterInsert()
  @AfterLoad()
  public lifecycleUuidLowerCase(): void {
    this.id = this.id.toLowerCase();
  }
}
