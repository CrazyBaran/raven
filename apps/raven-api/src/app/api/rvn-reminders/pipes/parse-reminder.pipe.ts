import { AbstractEntityPipe } from '../../../shared/pipes/abstract-entity.pipe';
import { ReminderEntity } from '../entities/reminder.entity';

export class ParseReminderPipe extends AbstractEntityPipe<ReminderEntity> {
  public readonly entityClass = ReminderEntity;
  public readonly resource = 'reminder';
  public readonly relations = ['assignees'];
}
