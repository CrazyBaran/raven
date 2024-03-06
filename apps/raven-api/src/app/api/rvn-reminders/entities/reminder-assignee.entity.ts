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
import { ReminderEntity } from './reminder.entity';

@Entity('reminder_assignee')
export class ReminderAssigneeEntity {
  @PrimaryColumn({ name: 'reminder_id' })
  @Index()
  public reminderId: string;

  @PrimaryColumn({ name: 'user_id' })
  @Index()
  public userId: string;

  @ManyToOne(() => ReminderEntity, (reminder) => reminder.assignees, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'reminder_id', referencedColumnName: 'id' }])
  public reminders: ReminderEntity[];

  @ManyToOne(() => UserEntity, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'user_id', referencedColumnName: 'id' }])
  public users: UserEntity[];

  public static create(
    partial: Partial<ReminderAssigneeEntity>,
  ): ReminderAssigneeEntity {
    return plainToInstance(ReminderAssigneeEntity, partial);
  }

  @AfterInsert()
  @AfterLoad()
  public lifecycleUuidLowerCase(): void {
    this.reminderId = this.reminderId?.toLowerCase();
    this.userId = this.userId?.toLowerCase();
  }
}
