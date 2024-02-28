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
import { UserEntity } from '../../rvn-users/entities/user.entity';
import { ShortlistEntity } from './shortlist.entity';

@Entity('shortlist_contributor')
export class ShortlistContributorEntity {
  @PrimaryColumn({ name: 'shortlist_id' })
  @Index()
  public shortlistId: string;

  @PrimaryColumn({ name: 'user_id' })
  @Index()
  public userId: string;

  @ManyToOne(() => ShortlistEntity, (shortlist) => shortlist.contributors, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'shortlist_id', referencedColumnName: 'id' }])
  public shortlists: ShortlistEntity[];

  @ManyToOne(() => UserEntity, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'user_id', referencedColumnName: 'id' }])
  public users: UserEntity[];

  public static create(
    partial: Partial<ShortlistContributorEntity>,
  ): ShortlistContributorEntity {
    return plainToInstance(ShortlistContributorEntity, partial);
  }

  @AfterInsert()
  @AfterLoad()
  public lifecycleUuidLowerCase(): void {
    this.shortlistId = this.shortlistId?.toLowerCase();
    this.userId = this.userId?.toLowerCase();
  }
}
