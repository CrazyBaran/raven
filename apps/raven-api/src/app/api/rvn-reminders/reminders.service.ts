import { ReminderStats, ReminderStatus } from '@app/rvns-reminders';
import { TagTypeEnum } from '@app/rvns-tags';
import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PagedData } from 'rvns-shared';
import { Brackets, In, Repository, SelectQueryBuilder } from 'typeorm';
import { ComplexTagEntity } from '../rvn-tags/entities/complex-tag.entity';
import {
  OrganisationTagEntity,
  TagEntity,
} from '../rvn-tags/entities/tag.entity';
import { UserEntity } from '../rvn-users/entities/user.entity';
import { GatewayEventService } from '../rvn-web-sockets/gateway/gateway-event.service';
import { ReminderAssigneeEntity } from './entities/reminder-assignee.entity';
import { ReminderEntity } from './entities/reminder.entity';
import { CompanyOpportunityTag } from './interfaces/company-opportunity-tag.interface';
import { GetRemindersStatsOptions } from './interfaces/get-reminders-stats.options';
import {
  GetRemindersOptions,
  defaultGetRemindersOptions,
} from './interfaces/get-reminders.options';
interface CreateReminderOptions {
  name: string;
  description?: string;
  dueDate: Date;
  assignees?: string[];
  tag?: { companyId: string; opportunityId?: string };
}

interface UpdateReminderOptions {
  name?: string;
  description?: string;
  dueDate?: Date;
  assignees?: string[];
  completed?: boolean;
  tag?: { companyId: string; opportunityId?: string };
}

@Injectable()
export class RemindersService {
  public constructor(
    @InjectRepository(ReminderEntity)
    private readonly remindersRepository: Repository<ReminderEntity>,
    @InjectRepository(ReminderAssigneeEntity)
    private readonly reminderAssigneeRepository: Repository<ReminderAssigneeEntity>,
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
    @InjectRepository(ComplexTagEntity)
    private readonly complexTagRepository: Repository<ComplexTagEntity>,
    private readonly gatewayEventService: GatewayEventService,
  ) {}

  public async findAll(
    options: GetRemindersOptions,
    userEntity?: UserEntity,
  ): Promise<PagedData<ReminderEntity>> {
    const queryBuilder =
      this.remindersRepository.createQueryBuilder('reminders');

    queryBuilder.leftJoin('reminders.assignees', 'assignees');
    queryBuilder.leftJoinAndSelect('reminders.tag', 'tag');
    queryBuilder
      .leftJoin('tag.tags', 'tags')
      .addSelect(['tags.id', 'tags.name', 'tags.type', 'tags.organisationId']);
    queryBuilder
      .leftJoin('reminders.assignedBy', 'assignedBy')
      .addSelect(['assignedBy.id', 'assignedBy.name']);

    if (options.assignee) {
      queryBuilder.andWhere('assignees.id = :assigneeId', {
        assigneeId: options.assignee,
      });
    }

    if (options.organisationId) {
      let filteredTags = await this.getTagsForOrganisation(options);

      if (options.opportunityId) {
        filteredTags = this.filterByOpportunityRelatedTags(
          filteredTags,
          options.opportunityId,
        );
      }

      if (filteredTags.length === 0) {
        return {
          items: [],
          total: 0,
        };
      }

      const tags = options.opportunityId
        ? [filteredTags[0].id]
        : [...filteredTags.map((tag) => tag.id)];
      queryBuilder.andWhere('reminders.tagId IN (:...tagIds)', {
        tagIds: tags,
      });
    }

    if (!options.assignee && !options.organisationId) {
      queryBuilder
        .andWhere(
          new Brackets((qb) => {
            qb.where('reminders.creatorId = :creatorId', {
              creatorId: userEntity.id,
            }).orWhere('reminders.assignedById = :assignedById', {
              assignedById: userEntity.id,
            });
          }),
        )
        .andWhere('assignees.id != :userId', {
          userId: userEntity.id,
        });
    }

    queryBuilder
      .leftJoin('reminders.assignees', 'assignees_full')
      .addSelect(['assignees_full.id', 'assignees_full.name']);
    const searchString = options.query
      ? `%${options.query.toLowerCase()}%`
      : undefined;

    if (searchString) {
      queryBuilder.andWhere(`LOWER(reminders.name) LIKE :nameSearch`, {
        nameSearch: searchString,
      });
    }

    this.addStatusQuery(options?.status, queryBuilder);

    if (options.skip || options.take) {
      queryBuilder
        .skip(options.skip ?? defaultGetRemindersOptions.skip)
        .take(options.take ?? defaultGetRemindersOptions.take);
    }

    const orderBy = `reminders.${
      options.orderBy ?? defaultGetRemindersOptions.orderBy
    }`;
    queryBuilder.addOrderBy(
      orderBy,
      options.direction ?? defaultGetRemindersOptions.direction,
    );

    const [reminders, count] = await queryBuilder.getManyAndCount();
    return {
      items: reminders,
      total: count,
    };
  }

  public async findOne(id: string): Promise<ReminderEntity> {
    const queryBuilder =
      this.remindersRepository.createQueryBuilder('reminders');

    queryBuilder.where({ id });
    queryBuilder
      .leftJoin('reminders.assignees', 'assignees')
      .addSelect(['assignees.id', 'assignees.name']);
    queryBuilder.leftJoinAndSelect('reminders.tag', 'tag');
    queryBuilder
      .leftJoin('tag.tags', 'tags')
      .addSelect(['tags.id', 'tags.name', 'tags.type', 'tags.organisationId']);

    queryBuilder
      .leftJoinAndSelect('tags.organisation', 'organisation')
      .leftJoinAndSelect('organisation.organisationDomains', 'domains');

    queryBuilder
      .leftJoin('reminders.assignedBy', 'assignedBy')
      .addSelect(['assignedBy.id', 'assignedBy.name']);

    const reminder = await queryBuilder.getOne();

    if (!reminder) {
      throw new NotFoundException();
    }

    return reminder;
  }

  public async create(
    options: CreateReminderOptions,
    tag: CompanyOpportunityTag,
    userData: UserEntity,
  ): Promise<ReminderEntity> {
    const assignees = await this.usersRepository.find({
      where: {
        id: In(options.assignees),
      },
    });

    if (assignees.length !== options.assignees?.length) {
      throw new NotFoundException('Some of assignees not found');
    }

    const reminder = new ReminderEntity();
    reminder.name = options.name;
    reminder.description = options.description;
    reminder.dueDate = options.dueDate;
    reminder.creatorId = userData.id;
    reminder.assignees = assignees;
    reminder.assignedById = userData.id;

    if (tag) {
      const complexTag = await this.getOrCreateComplexTag(tag);
      reminder.tag = complexTag;
    }

    await this.remindersRepository.save(reminder);

    this.gatewayEventService.emit('resource-reminders', {
      eventType: 'reminder-created',
      data: { id: reminder.id, dueDate: reminder.dueDate },
    });

    return await this.remindersRepository.findOne({
      where: { id: reminder.id },
      relations: ['assignees', 'tag', 'tag.tags', 'assignedBy'],
    });
  }

  public async update(
    reminderEntity: ReminderEntity,
    tag: CompanyOpportunityTag,
    options: UpdateReminderOptions,
    userEntity?: UserEntity,
  ): Promise<ReminderEntity> {
    this.assertCreatorOrAssignee(reminderEntity, userEntity);

    if (options.name) {
      reminderEntity.name = options.name;
    }

    if (options.description) {
      reminderEntity.description = options.description;
    }

    if (options.dueDate) {
      reminderEntity.dueDate = options.dueDate;
    }

    if (options.completed !== undefined) {
      reminderEntity.completedDate = options.completed ? new Date() : null;
    }

    if (options.tag) {
      reminderEntity.tag = await this.getOrCreateComplexTag(tag);
    }

    delete reminderEntity.assignees;

    if (options.assignees) {
      const assignees = await this.getAndValidateAssignees(options.assignees);
      const assigneesRelationsToAdd = [];

      const currentRelations = await this.reminderAssigneeRepository.find({
        where: {
          reminderId: reminderEntity.id,
        },
      });
      await this.reminderAssigneeRepository.manager.transaction(async (tem) => {
        await tem.remove(currentRelations);
        for (const assignee of assignees) {
          assigneesRelationsToAdd.push(
            ReminderAssigneeEntity.create({
              userId: assignee.id,
              reminderId: reminderEntity.id,
            }),
          );
        }

        await tem.save(assigneesRelationsToAdd);
      });

      if (assigneesRelationsToAdd.length > 0) {
        reminderEntity.assignedById = userEntity.id;
      }

      reminderEntity.updatedAt = new Date();
    }

    await this.remindersRepository.save(reminderEntity);

    this.gatewayEventService.emit('resource-reminders', {
      eventType: 'reminder-updated',
      data: {
        id: reminderEntity.id,
        dueDate: reminderEntity.dueDate,
        completed: options.completed,
      },
    });

    return await this.remindersRepository.findOne({
      where: { id: reminderEntity.id },
      relations: ['assignees', 'tag', 'tag.tags', 'assignedBy'],
    });
  }

  public async getStatsForUser(userEntity: UserEntity): Promise<ReminderStats> {
    const currentDate = new Date();
    const overdueForMeQueryBuilder =
      this.remindersRepository.createQueryBuilder('reminders');
    overdueForMeQueryBuilder.leftJoin('reminders.assignees', 'assignees');
    overdueForMeQueryBuilder
      .where('assignees.id = :userId', {
        userId: userEntity.id,
      })
      .andWhere('reminders.dueDate < :date', {
        date: currentDate,
      })
      .andWhere('reminders.completedDate IS NULL');

    const overdueForOthersqueryBuilder =
      this.remindersRepository.createQueryBuilder('reminders');
    overdueForOthersqueryBuilder.leftJoin('reminders.assignees', 'assignees');
    overdueForOthersqueryBuilder
      .where('assignees.id != :userId', {
        userId: userEntity.id,
      })
      .andWhere('reminders.dueDate < :date', {
        date: currentDate,
      })
      .andWhere('reminders.assignedById = :userId', {
        userId: userEntity.id,
      })
      .andWhere('reminders.completedDate IS NULL');

    const overdueForMeCount = await overdueForMeQueryBuilder.getCount();
    const overdueForOthersCount = await overdueForOthersqueryBuilder.getCount();

    return {
      overdue: {
        forMe: overdueForMeCount,
        forOthers: overdueForOthersCount,
        total: overdueForMeCount + overdueForOthersCount,
      },
    };
  }

  public async getStatsForOrganisation(
    options: GetRemindersStatsOptions,
  ): Promise<ReminderStats> {
    const overdueForOrganisationQueryBuilder =
      this.remindersRepository.createQueryBuilder('reminders');
    overdueForOrganisationQueryBuilder
      .where('reminders.dueDate < :date', {
        date: new Date(),
      })
      .andWhere('reminders.completedDate IS NULL');

    if (options.organisationId) {
      let filteredTags = await this.getTagsForOrganisation(options);

      if (options.opportunityId) {
        filteredTags = this.filterByOpportunityRelatedTags(
          filteredTags,
          options.opportunityId,
        );
      }

      if (filteredTags.length === 0) {
        return {
          overdue: {
            total: 0,
            forMe: null,
            forOthers: null,
          },
        };
      }

      const tags = options.opportunityId
        ? [filteredTags[0].id]
        : [...filteredTags.map((tag) => tag.id)];
      overdueForOrganisationQueryBuilder.andWhere(
        'reminders.tagId IN (:...tagIds)',
        {
          tagIds: tags,
        },
      );
    }

    const overdueCount = await overdueForOrganisationQueryBuilder.getCount();

    return {
      overdue: {
        forMe: null,
        forOthers: null,
        total: overdueCount,
      },
    };
  }

  public async remove(
    reminderEntity: ReminderEntity,
    userEntity: UserEntity,
  ): Promise<void> {
    if (reminderEntity.creatorId !== userEntity.id) {
      throw new ForbiddenException();
    }

    await this.remindersRepository.softDelete(reminderEntity.id);

    this.gatewayEventService.emit('resource-reminders', {
      eventType: 'reminder-deleted',
      data: { id: reminderEntity.id },
    });
  }

  private async getOrCreateComplexTag(
    tag: CompanyOpportunityTag,
  ): Promise<ComplexTagEntity> {
    const ids = [tag.companyTag.id];
    tag.opportunityTag && ids.push(tag.opportunityTag.id);
    const complexTagQueryBuilder =
      this.complexTagRepository.createQueryBuilder('complexTags');
    complexTagQueryBuilder.leftJoin('complexTags.tags', 'tags');
    complexTagQueryBuilder.where('tags.id IN (:...ids)', {
      ids: ids,
    });
    complexTagQueryBuilder.leftJoinAndSelect('complexTags.tags', 'tags_full');
    const existingComplexTags = await complexTagQueryBuilder.getMany();
    const filteredTags = existingComplexTags.filter(
      (ct) =>
        ct.tags.length === ids.length &&
        ct.tags.every((t) => ids.includes(t.id)),
    );

    if (filteredTags.length > 0) {
      return filteredTags[0];
    } else {
      const newComplexTag = this.complexTagRepository.create();
      const tags = [];
      tag.companyTag && tags.push(tag.companyTag);
      tag.opportunityTag && tags.push(tag.opportunityTag);

      newComplexTag.tags = tags;

      const complexTag = await this.complexTagRepository.save(newComplexTag);

      return complexTag;
    }
  }

  private async getTagsForOrganisation(
    options: GetRemindersStatsOptions,
  ): Promise<ComplexTagEntity[]> {
    const ids = [options.organisationId];
    options.opportunityId && ids.push(options.opportunityId);

    const complexTagQueryBuilder =
      this.complexTagRepository.createQueryBuilder('complexTags');
    complexTagQueryBuilder.leftJoin('complexTags.tags', 'tags');
    complexTagQueryBuilder.where('tags.organisationId = :organisationId', {
      organisationId: options.organisationId,
    });

    if (options.opportunityId) {
      complexTagQueryBuilder.orWhere('tags.id = :opportunityId', {
        opportunityId: options.opportunityId,
      });
    }

    complexTagQueryBuilder.leftJoinAndSelect('complexTags.tags', 'tags_full');
    const existingComplexTags = await complexTagQueryBuilder.getMany();

    const filteredTags = options.opportunityId
      ? existingComplexTags.filter(
          (ct) =>
            ct.tags.length === ids.length &&
            ct.tags.every((t: TagEntity) =>
              t instanceof OrganisationTagEntity
                ? ids.includes(t.organisationId)
                : ids.includes(t.id),
            ),
        )
      : existingComplexTags;

    return filteredTags;
  }

  private addStatusQuery(
    status: ReminderStatus,
    queryBuilder: SelectQueryBuilder<ReminderEntity>,
  ): SelectQueryBuilder<ReminderEntity> {
    if (!status) {
      return queryBuilder.andWhere('reminders.completedDate IS NULL');
    }

    const currentDate = new Date();
    switch (status) {
      case ReminderStatus.COMPLETED:
        queryBuilder.andWhere('reminders.completedDate IS NOT NULL');
        break;
      case ReminderStatus.DUE:
        queryBuilder.andWhere(
          new Brackets((qb) => {
            qb.where('reminders.dueDate > :currentDate', {
              currentDate,
            }).andWhere('reminders.completedDate IS NULL');
          }),
        );
        break;
      case ReminderStatus.OVERDUE:
        queryBuilder.andWhere(
          new Brackets((qb) => {
            qb.where('reminders.dueDate < :currentDate', {
              currentDate,
            }).andWhere('reminders.completedDate IS NULL');
          }),
        );
        break;
      default:
        break;
    }

    return queryBuilder;
  }

  private assertCreatorOrAssignee(
    reminderEntity: ReminderEntity,
    userEntity: UserEntity,
  ): void {
    if (
      reminderEntity.creatorId !== userEntity.id &&
      !reminderEntity.assignees.some(
        (assignee) => assignee.id === userEntity.id,
      )
    ) {
      throw new ForbiddenException();
    }
  }

  private async getAndValidateAssignees(
    assigneesIds: string[],
  ): Promise<UserEntity[]> {
    const assignees = await this.usersRepository.find({
      where: {
        id: In(assigneesIds),
      },
    });

    if (assignees.length !== assigneesIds?.length) {
      throw new NotFoundException('Some of assignees not found');
    }

    return assignees;
  }

  private filterByOpportunityRelatedTags(
    complexTags: ComplexTagEntity[],
    opportunityId: string,
  ): ComplexTagEntity[] {
    const opportunityTag = complexTags.find(
      (cTag) =>
        cTag.tags.filter(
          (tag) =>
            (tag.type === TagTypeEnum.Version ||
              tag.type === TagTypeEnum.Opportunity) &&
            tag.id === opportunityId,
        ).length,
    );
    return opportunityTag ? [opportunityTag] : [];
  }
}
