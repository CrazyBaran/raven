import {
  AfterInsert,
  AfterLoad,
  Entity,
  Index,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { TagEntity } from './tag.entity';

@Entity({ name: 'complex_tags' })
@Index(['id'], { unique: true })
export class ComplexTagEntity {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @ManyToMany(() => TagEntity, { eager: true })
  @JoinTable({
    name: 'complex_tag_tags',
    joinColumn: { name: 'complex_tag_id' },
    inverseJoinColumn: { name: 'tag_id' },
  })
  public tags: TagEntity[];

  @AfterInsert()
  @AfterLoad()
  public lifecycleUuidLowerCase(): void {
    this.id = this.id.toLowerCase();
  }
}
