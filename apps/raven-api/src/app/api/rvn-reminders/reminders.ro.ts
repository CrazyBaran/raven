import {
  PagedReminderData,
  ReminderAssignee,
  ReminderComplexTag,
  ReminderData,
  ReminderStats,
  ReminderStatsEntity,
  ReminderStatus,
  ReminderTag,
} from '@app/rvns-reminders';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude, plainToInstance } from 'class-transformer';
import { PagedData } from 'rvns-shared';
import { ReminderEntity } from './entities/reminder.entity';

class ReminderAssigneeRO implements ReminderAssignee {
  @ApiProperty()
  public id: string;

  @ApiProperty()
  public name: string;

  @Exclude()
  @ApiProperty()
  public azureId: string;

  @Exclude()
  @ApiProperty()
  public email: string;

  @Exclude()
  @ApiProperty()
  public createdAt: string;

  @Exclude()
  @ApiProperty()
  public updatedAt: string;
}

class ReminderTagRO implements ReminderTag {
  @ApiProperty()
  public id: string;

  @ApiProperty()
  public name: string;

  @ApiProperty()
  public type: string;

  @ApiProperty()
  public organisationId: string;

  @Exclude()
  @ApiProperty()
  public class: string;

  @Exclude()
  @ApiProperty()
  public userId: string;

  @Exclude()
  @ApiProperty()
  public tabId: string;

  @Exclude()
  @ApiProperty()
  public opportunityTagId: string;
}

class ReminderComplexTagRO implements ReminderComplexTag {
  @ApiProperty()
  public id: string;

  @ApiProperty()
  public tags: ReminderTagRO[];
}

export class ReminderRO implements ReminderData {
  @Exclude()
  @ApiProperty()
  public creatorId: string;

  @ApiProperty()
  public id: string;

  @ApiProperty()
  public name: string;

  @ApiProperty()
  public description: string;

  @ApiProperty()
  public dueDate: Date;

  @ApiProperty()
  public createdAt: Date;

  @ApiProperty()
  public updatedAt: Date;

  @Exclude()
  @ApiProperty()
  public deletedAt: Date;

  @Exclude()
  @ApiProperty()
  public completedDate: Date | null;

  @ApiProperty()
  public completed: boolean;

  @ApiProperty()
  public assignees: ReminderAssigneeRO[];

  @ApiProperty()
  public assignedBy: ReminderAssigneeRO | null;

  @Exclude()
  @ApiProperty()
  public assignedById: string | null;

  @ApiProperty()
  public tag: ReminderComplexTagRO;

  @Exclude()
  @ApiProperty()
  public tagId: string;

  @ApiProperty()
  public status: ReminderStatus;

  public static createFromEntity(entity: ReminderEntity): ReminderData {
    return plainToInstance(ReminderRO, {
      ...entity,
      assignees: entity.assignees?.map((assignees) =>
        plainToInstance(ReminderAssigneeRO, assignees),
      ),
      assignedBy: plainToInstance(ReminderAssigneeRO, entity.assignedBy),
      tag: entity.tag
        ? plainToInstance(ReminderComplexTagRO, {
            ...entity.tag,
            tags: entity.tag.tags?.map((tag) =>
              plainToInstance(ReminderTagRO, tag),
            ),
          })
        : null,
      status: ReminderRO.mapReminderStatus(entity),
    });
  }

  public static createFromArray = (array: ReminderEntity[]): ReminderData[] =>
    array?.map(ReminderRO.createFromEntity);

  public static mapReminderStatus(
    entity: Partial<ReminderEntity>,
  ): ReminderStatus {
    if (entity.completedDate) {
      return ReminderStatus.COMPLETED;
    }

    if (entity.dueDate < new Date()) {
      return ReminderStatus.OVERDUE;
    }

    return ReminderStatus.DUE;
  }
}

export class PagedReminderRO implements PagedData<ReminderRO> {
  @ApiProperty()
  public total: number;
  @ApiProperty({
    type: ReminderRO,
    default: [],
  })
  public items: ReminderRO[];

  public static createFromPagedData = (
    pagedData: PagedData<ReminderEntity>,
  ): PagedReminderData => ({
    total: pagedData.total,
    items: pagedData?.items.map(ReminderRO.createFromEntity),
  });
}

export class RemindersStatsEntityRO implements ReminderStatsEntity {
  @ApiProperty()
  public forMe: number;

  @ApiProperty()
  public forOthers: number;

  @ApiProperty()
  public total: number;

  public static createFromStatsEntityData = (
    statsEntity: ReminderStatsEntity,
  ): ReminderStatsEntity =>
    plainToInstance(RemindersStatsEntityRO, {
      ...statsEntity,
    });
}

export class RemindersStatsRO implements ReminderStats {
  @ApiProperty({
    type: RemindersStatsEntityRO,
  })
  public overdue: RemindersStatsEntityRO;

  public static createFromStatsData = (data: ReminderStats): ReminderStats =>
    plainToInstance(RemindersStatsRO, {
      overdue: {
        ...RemindersStatsEntityRO.createFromStatsEntityData(data.overdue),
      },
    });
}
