import {
  NoteAttachmentData,
  NoteData,
  NoteFieldData,
  NoteFieldGroupsWithFieldData,
  NoteTabsWithRelatedNotesData,
  NoteWithRelationsData,
  RelatedNoteWithFields,
  WorkflowNoteData,
} from '@app/rvns-notes/data-access';
import { TagData } from '@app/rvns-tags';
import { FieldDefinitionType, TemplateTypeEnum } from '@app/rvns-templates';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { cloneDeep } from 'lodash';
import { Brackets, ILike, In, Raw, Repository } from 'typeorm';
import { RavenLogger } from '../rvn-logger/raven.logger';
import { OpportunityEntity } from '../rvn-opportunities/entities/opportunity.entity';
import { OrganisationEntity } from '../rvn-opportunities/entities/organisation.entity';
import { StorageAccountService } from '../rvn-storage-account/storage-account.service';
import { ComplexTagEntity } from '../rvn-tags/entities/complex-tag.entity';
import {
  OrganisationTagEntity,
  PeopleTagEntity,
  TagEntity,
} from '../rvn-tags/entities/tag.entity';
import { FieldDefinitionEntity } from '../rvn-templates/entities/field-definition.entity';
import { FieldGroupEntity } from '../rvn-templates/entities/field-group.entity';
import { TabEntity } from '../rvn-templates/entities/tab.entity';
import { TemplateEntity } from '../rvn-templates/entities/template.entity';
import { UserEntity } from '../rvn-users/entities/user.entity';
import { GatewayEventService } from '../rvn-web-sockets/gateway/gateway-event.service';
import { NoteFieldGroupEntity } from './entities/note-field-group.entity';
import { NoteFieldEntity } from './entities/note-field.entity';
import { NoteTabEntity } from './entities/note-tab.entity';
import { NoteEntity } from './entities/note.entity';
import { CompanyOpportunityTag } from './interfaces/company-opportunity-tag.interface';

interface CreateNoteOptions {
  name: string;
  userEntity: UserEntity;
  templateEntity: TemplateEntity | null;
  tags: TagEntity[];
  fields: FieldUpdate[];
  rootVersionId?: string;
  companyOpportunityTags?: CompanyOpportunityTag[];
}

interface UpdateNoteFieldOptions {
  value: string;
}

interface FieldUpdate {
  id: string;
  value: string;
}

interface UpdateNoteOptions {
  tags: TagEntity[];
  fields: FieldUpdate[];
  name: string;
  templateEntity: TemplateEntity | null;
  companyOpportunityTags?: CompanyOpportunityTag[];
}

@Injectable()
export class NotesService {
  public constructor(
    @InjectRepository(NoteEntity)
    private readonly noteRepository: Repository<NoteEntity>,
    @InjectRepository(NoteFieldEntity)
    private readonly noteFieldRepository: Repository<NoteFieldEntity>,
    @InjectRepository(OpportunityEntity)
    private readonly opportunityRepository: Repository<OpportunityEntity>,
    @InjectRepository(OrganisationTagEntity)
    private readonly organisationTagRepository: Repository<OrganisationTagEntity>,
    @InjectRepository(TemplateEntity)
    private readonly templateRepository: Repository<TemplateEntity>,
    @InjectRepository(ComplexTagEntity)
    private readonly complexTagRepository: Repository<ComplexTagEntity>,
    @InjectRepository(OrganisationEntity)
    private readonly organisationRepository: Repository<OrganisationEntity>,
    private readonly storageAccountService: StorageAccountService,
    private readonly gatewayEventService: GatewayEventService,
    private readonly logger: RavenLogger,
  ) {
    this.logger.setContext(NotesService.name);
  }

  public async getAllNotes(
    me: UserEntity,
    organisationTagEntity?: OrganisationTagEntity,
    tagEntities?: TagEntity[],
    type?: TemplateTypeEnum,
    skip?: number,
    take?: number,
    dir?: 'ASC' | 'DESC',
    field?: 'createdAt' | 'updatedAt' | 'name',
    query?: string,
    noteType?: string,
    createdBy?: string,
    assignedTo?: string,
    role?: 'created' | 'tagged',
  ): Promise<{ items: NoteEntity[]; total: number }> {
    const organisationTagIds: string[] = [];
    if (organisationTagEntity) {
      organisationTagIds.push(organisationTagEntity.id);
    }
    if (query) {
      const queryOrganisations = query
        ? await this.organisationRepository.find({
            where: { name: ILike(`%${query}%`) },
          })
        : [];
      const organisationIds = queryOrganisations.map((o) => o.id);
      const organisationTags = await this.organisationTagRepository.find({
        where: { organisationId: In(organisationIds) },
      });
      if (organisationTags) {
        organisationTagIds.push(...organisationTags.map((o) => o.id));
      }
    }

    const complexTagsForOrganisations =
      organisationTagIds.length > 0
        ? await this.complexTagRepository
            .createQueryBuilder('complexTag')
            .innerJoin(
              'complexTag.tags',
              'organisationComplexTag',
              'organisationComplexTag.id IN (:...organisationComplexTagIds)',
              {
                organisationComplexTagIds: organisationTagIds,
              },
            )
            .getMany()
        : [];

    const orgTagSubQuery = this.noteRepository
      .createQueryBuilder('note_with_tag')
      .select('note_with_tag.id')
      .innerJoin('note_with_tag.tags', 'tag')
      .where('tag.id IN (:...orgTagIds)');

    const subQuery = this.noteRepository
      .createQueryBuilder('note_sub')
      .select('MAX(note_sub.version)', 'maxVersion')
      .where('LOWER(note_sub.rootVersionId) = LOWER(note.rootVersionId)');

    const queryBuilder = this.noteRepository
      .createQueryBuilder('note')
      .leftJoinAndMapOne('note.createdBy', 'note.createdBy', 'createdBy')
      .leftJoinAndMapOne('note.updatedBy', 'note.updatedBy', 'updatedBy')
      .leftJoinAndMapMany('note.tags', 'note.tags', 'tags')
      .leftJoinAndMapMany('note.complexTags', 'note.complexTags', 'complexTags')
      .leftJoinAndMapMany(
        'complexTags.tags',
        'complexTags.tags',
        'complexTagsTags',
      )
      .leftJoinAndMapOne('note.template', 'note.template', 'template')
      .where(`note.version = (${subQuery.getQuery()})`)
      .andWhere('note.deletedAt IS NULL');

    if (type) {
      queryBuilder.andWhere('template.type = :type', { type });
    }

    if (noteType) {
      queryBuilder.andWhere('template.name = :noteType', { noteType });
    }

    if (role === 'created') {
      createdBy = me.id;
    } else if (role === 'tagged') {
      assignedTo = me.id;
    }

    if (createdBy) {
      queryBuilder.andWhere('createdBy.id = :createdBy', { createdBy });
    }

    if (assignedTo) {
      const tagAssignedTo = await this.noteRepository.manager
        .createQueryBuilder(PeopleTagEntity, 'peopleTag')
        .select()
        .where('peopleTag.userId = :assignedTo', { assignedTo })
        .getOne();

      if (tagAssignedTo) tagEntities = [...tagEntities, tagAssignedTo];
    }

    if (organisationTagIds.length > 0) {
      queryBuilder
        .andWhere(`note.id IN (${orgTagSubQuery.getQuery()})`)
        .setParameter('orgTagIds', organisationTagIds);

      if (
        complexTagsForOrganisations &&
        complexTagsForOrganisations.length > 0
      ) {
        queryBuilder.orWhere('complexTags.id IN (:...complexTagIds)', {
          complexTagIds: complexTagsForOrganisations?.map((ct) => ct.id),
        });
      }
    } else if (
      complexTagsForOrganisations &&
      complexTagsForOrganisations.length > 0
    ) {
      queryBuilder.where('complexTags.id IN (:...complexTagIds)', {
        complexTagIds: complexTagsForOrganisations?.map((ct) => ct.id),
      });
    }

    if (tagEntities) {
      for (const tag of tagEntities) {
        const tagSubQuery = this.noteRepository
          .createQueryBuilder('note_with_tag')
          .select('note_with_tag.id')
          .innerJoin('note_with_tag.tags', 'tag')
          .where('tag.id = :tagId');

        queryBuilder
          .andWhere(`note.id IN (${tagSubQuery.getQuery()})`)
          .setParameter('tagId', tag.id);
      }
    }

    queryBuilder.orderBy(`note.${field ?? 'createdAt'}`, dir ?? 'DESC');

    queryBuilder.skip(skip ? skip : 0).take(take ? take : 10);
    if (query) {
      const searchString = `%${query.toLowerCase()}%`;
      queryBuilder.andWhere([
        {
          name: Raw(
            (alias) => `(CAST(${alias} as NVARCHAR(100))) LIKE :searchString`,
            {
              searchString,
            },
          ),
        },
        {
          'createdBy.name': Raw(
            (alias) => `(CAST(${alias} as NVARCHAR(100))) LIKE :searchString`,
            {
              searchString,
            },
          ),
        },
        {
          'updatedBy.name': Raw(
            (alias) => `(CAST(${alias} as NVARCHAR(100))) LIKE :searchString`,
            {
              searchString,
            },
          ),
        },
        {
          'template.name': Raw(
            (alias) => `(CAST(${alias} as NVARCHAR(100))) LIKE :searchString`,
            {
              searchString,
            },
          ),
        },
      ]);
    }
    const [items, total] = await queryBuilder.getManyAndCount();
    return { items, total };
  }

  public async getAllNoteVersions(
    noteEntity: NoteEntity,
  ): Promise<NoteEntity[]> {
    const qb = this.noteRepository
      .createQueryBuilder('note')
      .leftJoinAndSelect('note.createdBy', 'createdBy')
      .leftJoinAndSelect('note.deletedBy', 'deletedBy')
      .leftJoinAndSelect('note.updatedBy', 'updatedBy')
      .leftJoinAndSelect('note.noteTabs', 'noteTabs')
      .leftJoinAndSelect('noteTabs.noteFieldGroups', 'noteFieldGroups')
      .leftJoinAndSelect('noteFieldGroups.noteFields', 'noteFields')
      .leftJoinAndSelect('note.noteFieldGroups', 'noteFieldGroupsDirect')
      .leftJoinAndSelect('noteFieldGroupsDirect.noteFields', 'noteFieldsDirect')
      .where('note.rootVersionId = :rootVersionId', {
        rootVersionId: noteEntity.rootVersionId,
      });

    return await qb.getMany();
  }

  public async getNotesForOpportunity(
    opportunityId: string,
    type: TemplateTypeEnum,
  ): Promise<(WorkflowNoteData | NoteWithRelationsData)[]> {
    const opportunity = await this.opportunityRepository.findOne({
      where: { id: opportunityId },
      relations: ['organisation', 'tag'],
    });
    if (!opportunity) {
      throw new BadRequestException(
        `Opportunity with id ${opportunityId} not found`,
      );
    }

    const organisationTag = await this.organisationTagRepository.findOne({
      where: { organisationId: opportunity.organisation.id },
    });
    if (!organisationTag) {
      this.logger.warn(
        `Organisation tag for opportunity with id ${opportunityId} not found`,
      );
    }

    const complexTagsForOpportunity = await this.complexTagRepository
      .createQueryBuilder('complexTag')
      .innerJoin(
        'complexTag.tags',
        'opportunityComplexTag',
        'opportunityComplexTag.id = :opportunityComplexTagId',
        {
          opportunityComplexTagId: opportunity.tagId,
        },
      )
      .innerJoin(
        'complexTag.tags',
        'organisationComplexTag',
        'organisationComplexTag.id = :organisationComplexTagId',
        {
          organisationComplexTagId: organisationTag.id,
        },
      )
      .getMany();

    const subQuery = this.noteRepository
      .createQueryBuilder('note_sub')
      .select('MAX(note_sub.version)', 'maxVersion')
      .where('LOWER(note_sub.rootVersionId) = LOWER(note.rootVersionId)');

    const qb = this.noteRepository
      .createQueryBuilder('note')
      .leftJoinAndSelect('note.createdBy', 'createdBy')
      .leftJoinAndSelect('note.deletedBy', 'deletedBy')
      .leftJoinAndSelect('note.updatedBy', 'updatedBy')
      .leftJoinAndSelect('note.complexTags', 'complexTags')
      .leftJoinAndSelect('complexTags.tags', 'complexTagsTags')
      .leftJoinAndSelect('note.noteFieldGroups', 'noteFieldGroups')
      .leftJoinAndSelect('noteFieldGroups.noteFields', 'noteFields')
      .leftJoinAndSelect('note.template', 'template');

    if (opportunity.tag) {
      qb.leftJoinAndSelect(
        'note.tags',
        'opportunityTag',
        'opportunityTag.id = :opportunityTagId',
        { opportunityTagId: opportunity.tag.id },
      );
    }
    qb.leftJoinAndSelect(
      'note.tags',
      'organisationTag',
      'organisationTag.id = :organisationTagId',
      {
        organisationTagId: organisationTag.id,
      },
    );

    qb.leftJoinAndSelect('note.tags', 'allTags')
      .where(
        new Brackets((qb) => {
          qb.where(
            new Brackets((qb) => {
              qb.where('organisationTag.id IS NOT NULL');
              if (opportunity.tag) {
                qb.andWhere('opportunityTag.id IS NOT NULL');
              }
              return qb;
            }),
          );
          if (complexTagsForOpportunity?.length > 0) {
            qb.orWhere('complexTags.id IN (:...complexTagIds)', {
              complexTagIds: complexTagsForOpportunity?.map((ct) => ct.id),
            });
          }

          return qb;
        }),
      )
      .andWhere(`note.version = (${subQuery.getQuery()})`)
      .andWhere('note.deletedAt IS NULL')
      .andWhere('template.type = :type', { type: TemplateTypeEnum.Note });

    const relatedNotes = await qb.getMany();

    if (type === TemplateTypeEnum.Note) {
      return relatedNotes
        .map((rn) => {
          delete rn.noteFieldGroups;
          delete rn.noteTabs;
          return rn; // we remove note fields data to make response smaller
        })
        .map(this.noteEntityToNoteData.bind(this));
    }

    if (!opportunity.noteId) {
      return [];
    }

    const opportunityNote = await this.noteRepository
      .createQueryBuilder('note')
      .leftJoinAndSelect('note.createdBy', 'createdBy')
      .leftJoinAndSelect('note.updatedBy', 'updatedBy')
      .leftJoinAndSelect('note.deletedBy', 'deletedBy')
      .leftJoinAndSelect('note.tags', 'tags')
      .where('note.id = :id', { id: opportunity.noteId })
      .getOne();

    // funny performance hack - we need to get all tabs and fields for opportunity note
    const allTabs = await this.noteRepository
      .createQueryBuilder('note')
      .leftJoinAndSelect('note.noteTabs', 'noteTabs')
      .leftJoinAndSelect('noteTabs.noteFieldGroups', 'noteFieldGroups')
      .leftJoinAndSelect('noteFieldGroups.noteFields', 'noteFields')
      .where('note.id = :id', { id: opportunity.noteId })
      .getOne();

    const allFieldGroups = await this.noteRepository
      .createQueryBuilder('note')
      .leftJoinAndSelect('note.noteFieldGroups', 'noteFieldGroups')
      .leftJoinAndSelect('noteFieldGroups.noteFields', 'noteFields')
      .where('note.id = :id', { id: opportunity.noteId })
      .getOne();

    opportunityNote.noteTabs = allTabs.noteTabs;
    opportunityNote.noteFieldGroups = allFieldGroups.noteFieldGroups;

    const start = new Date().getTime();
    const opportunityNoteTemplate = await this.templateRepository
      .createQueryBuilder('template')
      .leftJoinAndSelect('template.tabs', 'tab')
      .leftJoinAndSelect('tab.relatedTemplates', 'relatedTemplate')
      .leftJoinAndSelect('tab.pipelineStages', 'pipelineStage')
      .leftJoinAndSelect('tab.relatedFields', 'relatedFields')
      .leftJoinAndSelect('tab.fieldGroups', 'fieldGroups')
      .leftJoinAndSelect('fieldGroups.fieldDefinitions', 'fieldDefinitions')
      .leftJoinAndSelect(
        'fieldDefinitions.hideOnPipelineStages',
        'hideOnPipelineStages',
      )
      .select([
        'template.id',
        'template.name',
        'template.type',
        'tab.id',
        'tab.name',
        'pipelineStage.id',
        'pipelineStage.displayName',
        'relatedTemplate.id',
        'relatedFields.id',
        'fieldGroups.id',
        'fieldGroups.name',
        'fieldDefinitions.id',
        'fieldDefinitions.name',
        'hideOnPipelineStages.id',
      ])
      .where('template.id = :templateId', {
        templateId: opportunityNote.templateId,
      })
      .getOne();

    this.logger.debug(
      'get opportunity note template took: ',
      new Date().getTime() - start,
    );

    // we resolve these relations manually because typeorm lacks performance in doing so...
    opportunityNote.template = opportunityNoteTemplate;
    opportunity.note = opportunityNote;

    const workflowNote = this.transformNotesToNoteWithRelatedData(
      opportunity.note,
      relatedNotes,
      opportunity.pipelineStageId,
    );

    if (type === TemplateTypeEnum.Workflow) {
      return [workflowNote];
    }

    const mappedRelatedNotes: NoteWithRelationsData[] = relatedNotes
      .map((rn) => {
        delete rn.noteFieldGroups;
        delete rn.noteTabs;
        return rn; // we remove note fields data to make response smaller
      })
      .map(this.noteEntityToNoteData.bind(this));
    return [workflowNote, ...mappedRelatedNotes];
  }

  public filterWorkflowNote(
    workflowNote: NoteEntity,
    currentPipelineStageId: string,
  ): NoteEntity {
    const templateFieldsFlat = workflowNote.template?.tabs
      .map((t) => t.fieldGroups || [])
      .flat()
      .map((fg) => fg.fieldDefinitions || [])
      .flat();

    const filteredNote = cloneDeep(workflowNote);

    filteredNote.noteTabs = filteredNote.noteTabs
      ?.filter((nt) => {
        const relatedTemplateTab = workflowNote.template?.tabs.find(
          (t) => t.name === nt.name,
        );
        if (!relatedTemplateTab) {
          return true; // we don't hide tabs that do not exist in template anymore
        }
        const pipelineStageFound = relatedTemplateTab.pipelineStages?.find(
          (hops) => hops.id === currentPipelineStageId,
        );
        return !!pipelineStageFound;
      })
      ?.map((nt) => {
        nt.noteFieldGroups = nt.noteFieldGroups?.map((nfg) => {
          nfg.noteFields = nfg.noteFields?.filter((nf) => {
            const fieldDefinition = templateFieldsFlat.find(
              (tf) => tf.id === nf.templateFieldId,
            );
            if (!fieldDefinition) {
              return true; // we don't hide fields that do not exist in template anymore
            }
            return !fieldDefinition.hideOnPipelineStages?.find(
              (hops) => hops.id === currentPipelineStageId,
            );
          });
          return nfg;
        });
        return nt;
      });

    return filteredNote;
  }

  public async createNote(options: CreateNoteOptions): Promise<NoteEntity> {
    if (options.templateEntity) {
      const createdNote = await this.createNoteFromTemplate(
        options.name,
        options.fields,
        options.tags,
        options.templateEntity,
        options.userEntity,
        null,
        options.rootVersionId,
        options.companyOpportunityTags,
      );
      this.emitNoteCreatedEvent(createdNote);
      return createdNote;
    }

    const noteField = new NoteFieldEntity();
    noteField.name = "Note's content";
    noteField.order = 1;
    noteField.createdBy = options.userEntity;
    noteField.updatedBy = options.userEntity;
    noteField.type = FieldDefinitionType.RichText;

    const noteFieldGroup = new NoteFieldGroupEntity();
    noteFieldGroup.name = 'New Note Group';
    noteFieldGroup.order = 1;
    noteFieldGroup.createdBy = options.userEntity;
    noteFieldGroup.updatedBy = options.userEntity;
    noteFieldGroup.noteFields = [noteField];

    const note = new NoteEntity();
    note.name = options.name;
    note.version = 1;
    if (options.rootVersionId) {
      note.rootVersionId = options.rootVersionId;
    }
    note.tags = options.tags;
    note.complexTags = this.getComplexNoteTags(options.companyOpportunityTags);
    note.createdBy = options.userEntity;
    note.updatedBy = options.userEntity;
    note.noteFieldGroups = [noteFieldGroup];

    const createdNote = await this.noteRepository.save(note);
    this.emitNoteCreatedEvent(createdNote);
    return createdNote;
  }

  public async updateNote(
    noteEntity: NoteEntity | WorkflowNoteData,
    userEntity: UserEntity,
    options: UpdateNoteOptions,
  ): Promise<NoteEntity> {
    return await this.noteRepository.manager.transaction(async (tem) => {
      let start = new Date().getTime();

      const templateType =
        (noteEntity as NoteEntity)?.template?.type ||
        (noteEntity as WorkflowNoteData).templateType;

      const latestVersion = await this.noteRepository
        .createQueryBuilder('note')
        .where('LOWER(note.rootVersionId) = LOWER(:rootVersionId)', {
          rootVersionId: noteEntity.rootVersionId,
        })
        .orderBy('note.version', 'DESC')
        .getOne();

      // TODO remove debug
      this.logger.debug(
        'get latest version took: ',
        new Date().getTime() - start,
      );

      if (options.templateEntity) {
        const updatedNote = await this.createNoteFromTemplate(
          options.name,
          options.fields,
          options.tags,
          options.templateEntity,
          userEntity,
          (noteEntity as NoteEntity).createdBy,
          noteEntity.rootVersionId,
          options.companyOpportunityTags,
          latestVersion.version + 1,
        );
        this.emitNoteUpdatedEvent(updatedNote);
        return updatedNote;
      }

      start = new Date().getTime();
      const newNoteVersion = new NoteEntity();
      newNoteVersion.name = options.name || noteEntity.name;
      newNoteVersion.rootVersionId = noteEntity.rootVersionId;
      newNoteVersion.version = latestVersion.version + 1;
      newNoteVersion.tags = options.tags;
      newNoteVersion.complexTags = this.getComplexNoteTags(
        options.companyOpportunityTags,
      );
      newNoteVersion.templateId = noteEntity.templateId;
      newNoteVersion.previousVersion = latestVersion;
      newNoteVersion.createdById = noteEntity.createdById;
      newNoteVersion.updatedBy = userEntity;
      newNoteVersion.noteTabs = noteEntity.noteTabs.map((noteTab) => {
        const newNoteTab = new NoteTabEntity();
        newNoteTab.name = noteTab.name;
        newNoteTab.order = noteTab.order;
        newNoteTab.createdBy = noteTab.createdBy;
        newNoteTab.createdById = noteTab.createdById;
        newNoteTab.updatedBy = userEntity;
        newNoteTab.noteFieldGroups = noteTab.noteFieldGroups.map(
          this.getNewGroupsAndFieldsMapping(
            userEntity,
            newNoteVersion,
            options,
          ),
        );
        return newNoteTab;
      });
      if (templateType === TemplateTypeEnum.Note) {
        newNoteVersion.noteFieldGroups = (
          noteEntity as NoteEntity
        ).noteFieldGroups
          ?.filter((nfg) => !nfg.noteTabId)
          .map(
            this.getNewGroupsAndFieldsMapping(
              userEntity,
              newNoteVersion,
              options,
            ),
          );
      }

      const savedNewNoteVersion = await tem.save(newNoteVersion);
      this.logger.debug(
        'save new note version took: ',
        new Date().getTime() - start,
      );

      if (templateType === TemplateTypeEnum.Workflow) {
        start = new Date().getTime();
        const opportunity = await this.opportunityRepository.findOne({
          where: { noteId: noteEntity.id },
          relations: ['note'],
        });
        if (opportunity) {
          if (
            opportunity.note &&
            opportunity.note.rootVersionId !== noteEntity.rootVersionId
          ) {
            throw new Error(
              'Updated note root version id does not match workflow note root version id',
            );
          }
          delete opportunity.note;
          opportunity.noteId = savedNewNoteVersion.id;

          await tem.save(opportunity);
        }
        this.logger.debug(
          'update opportunity noteId took: ',
          new Date().getTime() - start,
        );
        // performance hack - when we update workflow note, we get the origin workflow note data but we need to return fields existing in entity for this to work
        savedNewNoteVersion.template = {
          type: TemplateTypeEnum.Workflow,
        } as TemplateEntity;
      }
      if (templateType === TemplateTypeEnum.Note) {
        this.emitNoteUpdatedEvent(savedNewNoteVersion);
      }
      return savedNewNoteVersion;
    });
  }

  public async getNoteForUpdate(id: string): Promise<NoteEntity> {
    const start = Date.now();
    const qb = this.noteRepository
      .createQueryBuilder('note')
      .leftJoinAndSelect('note.createdBy', 'createdBy')
      .leftJoinAndSelect('note.updatedBy', 'updatedBy')
      .leftJoinAndSelect('note.tags', 'tags')
      .leftJoinAndSelect('note.complexTags', 'complexTags')
      .leftJoinAndSelect('note.noteTabs', 'noteTabs')
      .leftJoinAndSelect('noteTabs.noteFieldGroups', 'noteFieldGroups')
      .leftJoinAndSelect('noteFieldGroups.noteFields', 'noteFields')
      .leftJoinAndSelect('note.noteFieldGroups', 'noteFieldGroupsDirect')
      .leftJoinAndSelect('noteFieldGroupsDirect.noteFields', 'noteFieldsDirect')
      .leftJoin('note.template', 'template')
      .addSelect(['template.type', 'template.name', 'template.id'])
      .where('note.id = :id', { id });

    const note = await qb.getOne();

    // TODO remove debug
    console.log(`NoteRepository.getOne took ${Date.now() - start}ms`);

    if (!note) {
      throw new Error(`Note with id ${id} not found`);
    }
    return note;
  }

  public async deleteNotes(
    noteEntities: NoteEntity[],
    userEntity: UserEntity,
    latestVersion: NoteEntity,
  ): Promise<void> {
    await this.noteRepository.manager.transaction(async (tem) => {
      for (const noteEntity of noteEntities) {
        delete noteEntity.noteFieldGroups;
        delete noteEntity.noteTabs;
        delete noteEntity.tags;
        noteEntity.deletedAt = new Date();
        noteEntity.deletedBy = userEntity;
        await tem.save(noteEntity);
      }
    });
    this.emitNoteDeletedEvent(latestVersion);
  }

  public async getNoteAttachments(
    noteEntity: NoteEntity,
  ): Promise<NoteAttachmentData[]> {
    return await this.storageAccountService.getStorageAccountFiles(
      noteEntity.rootVersionId,
    );
  }

  // TODO think about moving mapping loogic outside of service
  public noteEntityToNoteData(noteEntity: NoteEntity): NoteWithRelationsData {
    return {
      id: noteEntity.id,
      name: noteEntity.name,
      version: noteEntity.version,
      rootVersionId: noteEntity.rootVersionId,
      templateName: noteEntity.template?.name,
      templateId: noteEntity.templateId,
      templateType: noteEntity.template?.type as TemplateTypeEnum,
      createdById: noteEntity.createdById,
      createdBy: {
        name: noteEntity.createdBy?.name,
        email: noteEntity.createdBy?.email,
      },
      updatedById: noteEntity.updatedById,
      updatedBy: {
        name: noteEntity.updatedBy.name,
        email: noteEntity.updatedBy.email,
      },
      updatedAt: noteEntity.updatedAt,
      createdAt: noteEntity.createdAt,
      deletedAt: noteEntity.deletedAt,
      deletedBy: noteEntity.deletedBy
        ? {
            name: noteEntity.deletedBy.name,
            email: noteEntity.deletedBy.email,
          }
        : undefined,
      tags: noteEntity.tags?.map(this.mapTag.bind(this)),
      complexTags: noteEntity.complexTags?.map((complexTag) => ({
        id: complexTag.id,
        tags: complexTag.tags?.map(this.mapTag.bind(this)),
      })),
      noteTabs: noteEntity.noteTabs?.map((noteTab) => {
        return {
          id: noteTab.id,
          name: noteTab.name,
          order: noteTab.order,
          noteId: noteTab.noteId,
          createdById: noteTab.createdById,
          updatedById: noteTab.updatedById,
          updatedAt: noteTab.updatedAt,
          createdAt: noteTab.createdAt,
          noteFieldGroups: noteTab.noteFieldGroups?.map(
            this.mapNoteFieldGroupEntityToFieldGroupData.bind(this),
          ),
        };
      }),

      noteFieldGroups: noteEntity.noteFieldGroups
        ?.filter((nfg) => !nfg.noteTabId)
        .map((noteFieldGroup) => {
          return {
            id: noteFieldGroup.id,
            name: noteFieldGroup.name,
            order: noteFieldGroup.order,
            noteId: noteFieldGroup.noteId,
            createdById: noteFieldGroup.createdById,
            updatedById: noteFieldGroup.updatedById,
            updatedAt: noteFieldGroup.updatedAt,
            createdAt: noteFieldGroup.createdAt,
            noteFields: noteFieldGroup.noteFields?.map((noteField) =>
              this.noteFieldEntityToNoteFieldData(noteField),
            ),
          };
        }),
    };
  }

  public noteFieldEntityToNoteFieldData(
    noteFieldEntity: NoteFieldEntity,
  ): NoteFieldData {
    return {
      id: noteFieldEntity.id,
      templateFieldId: noteFieldEntity.templateFieldId,
      name: noteFieldEntity.name,
      type: noteFieldEntity.type,
      order: noteFieldEntity.order,
      value: noteFieldEntity.value,
      noteGroupId: noteFieldEntity.noteGroupId,
      createdById: noteFieldEntity.createdById,
      updatedById: noteFieldEntity.updatedById,
      updatedAt: noteFieldEntity.updatedAt,
      createdAt: noteFieldEntity.createdAt,
      configuration: noteFieldEntity.configuration
        ? JSON.parse(noteFieldEntity.configuration)
        : null,
    };
  }

  private mapTag(
    tag: TagEntity | OrganisationTagEntity | PeopleTagEntity,
  ): TagData {
    return {
      name: tag.name,
      type: tag.type,
      id: tag.id,
      organisationId: (tag as OrganisationTagEntity).organisationId,
      userId: (tag as PeopleTagEntity).userId,
    };
  }

  private mapNoteFieldGroupEntityToFieldGroupData(
    noteFieldGroup: NoteFieldGroupEntity,
  ): NoteFieldGroupsWithFieldData {
    return {
      id: noteFieldGroup.id,
      name: noteFieldGroup.name,
      order: noteFieldGroup.order,
      noteId: noteFieldGroup.noteId,
      createdById: noteFieldGroup.createdById,
      updatedById: noteFieldGroup.updatedById,
      updatedAt: noteFieldGroup.updatedAt,
      createdAt: noteFieldGroup.createdAt,
      noteFields: noteFieldGroup.noteFields?.map((noteField) =>
        this.noteFieldEntityToNoteFieldData(noteField),
      ),
    };
  }

  private async createNoteFromTemplate(
    name: string,
    fields: FieldUpdate[],
    tags: TagEntity[],
    templateEntity: TemplateEntity,
    userEntity: UserEntity,
    originalCreator: UserEntity | null,
    rootVersionId?: string,
    companyOpportunityTags?: CompanyOpportunityTag[],
    version = 1,
  ): Promise<NoteEntity> {
    const note = new NoteEntity();
    note.name = name;
    note.version = version;
    note.tags = tags;
    note.complexTags = this.getComplexNoteTags(companyOpportunityTags);
    note.template = templateEntity;
    note.createdBy = originalCreator ? originalCreator : userEntity;
    note.updatedBy = userEntity;
    if (rootVersionId) {
      note.rootVersionId = rootVersionId;
    }
    note.noteTabs = templateEntity.tabs.map((tab) => {
      const noteTab = new NoteTabEntity();
      noteTab.name = tab.name;
      noteTab.order = tab.order;
      noteTab.createdBy = userEntity;
      noteTab.updatedBy = userEntity;
      noteTab.noteFieldGroups = tab.fieldGroups.map(
        this.getMapFieldGroupToNoteFieldGroup(userEntity, note, fields),
      );
      return noteTab;
    });
    note.noteFieldGroups = templateEntity.fieldGroups.map(
      this.getMapFieldGroupToNoteFieldGroup(userEntity, note, fields),
    );

    return await this.noteRepository.save(note);
  }

  private getMapFieldGroupToNoteFieldGroup(
    userEntity: UserEntity,
    note: NoteEntity,
    fields: FieldUpdate[] = [],
  ): (fieldGroup: FieldGroupEntity) => NoteFieldGroupEntity {
    return (fieldGroup: FieldGroupEntity) => {
      const noteFieldGroup = new NoteFieldGroupEntity();
      noteFieldGroup.name = fieldGroup.name;
      noteFieldGroup.order = fieldGroup.order;
      noteFieldGroup.createdBy = userEntity;
      noteFieldGroup.updatedBy = userEntity;
      noteFieldGroup.note = note;
      noteFieldGroup.noteFields = fieldGroup.fieldDefinitions.map(
        (fieldDefinition: FieldDefinitionEntity) => {
          const noteField = new NoteFieldEntity();
          noteField.name = fieldDefinition.name;
          noteField.order = fieldDefinition.order;
          noteField.type = fieldDefinition.type;
          noteField.templateFieldId = fieldDefinition.id;
          noteField.createdBy = userEntity;
          noteField.updatedBy = userEntity;
          noteField.value = this.findFieldValue(fieldDefinition, fields);
          noteField.configuration = fieldDefinition.configuration;
          return noteField;
        },
      );
      return noteFieldGroup;
    };
  }

  private getNewGroupsAndFieldsMapping(
    userEntity: UserEntity,
    newNoteVersion: NoteEntity,
    options: UpdateNoteOptions,
  ): (noteFieldGroup: NoteFieldGroupEntity) => NoteFieldGroupEntity {
    return (noteFieldGroup: NoteFieldGroupEntity) => {
      const newNoteFieldGroup = new NoteFieldGroupEntity();
      newNoteFieldGroup.name = noteFieldGroup.name;
      newNoteFieldGroup.order = noteFieldGroup.order;
      newNoteFieldGroup.createdById = noteFieldGroup.createdById;
      newNoteFieldGroup.updatedBy = userEntity;
      newNoteFieldGroup.note = newNoteVersion;
      newNoteFieldGroup.noteFields = noteFieldGroup.noteFields.map(
        (noteField) => {
          const newNoteField = new NoteFieldEntity();
          newNoteField.name = noteField.name;
          newNoteField.order = noteField.order;
          newNoteField.type = noteField.type;
          newNoteField.templateFieldId = noteField.templateFieldId;
          newNoteField.createdById = noteField.createdById;
          newNoteField.updatedBy = userEntity;
          newNoteField.value = this.findFieldValue(noteField, options.fields);
          newNoteField.configuration =
            typeof noteField.configuration === 'object' &&
            !!noteField.configuration
              ? JSON.stringify(noteField.configuration)
              : noteField.configuration;
          return newNoteField;
        },
      );
      return newNoteFieldGroup;
    };
  }

  private findFieldValue(
    fieldEntity: NoteFieldEntity | FieldDefinitionEntity,
    fieldUpdates?: FieldUpdate[],
  ): string {
    const fieldUpdate = fieldUpdates?.find((fu) => fu.id === fieldEntity.id);
    // if it's a field definition, it's a new field, so we don't need to check for a default value
    const defaultValue = (fieldEntity as NoteFieldEntity).value
      ? (fieldEntity as NoteFieldEntity).value
      : null;
    return fieldUpdate ? fieldUpdate.value : defaultValue;
  }

  private getComplexNoteTags(
    companyOpportunityTags?: CompanyOpportunityTag[],
  ): ComplexTagEntity[] {
    return companyOpportunityTags?.map((companyOpportunityTag) => {
      const complexTag = new ComplexTagEntity();
      complexTag.tags = [
        companyOpportunityTag.companyTag,
        companyOpportunityTag.opportunityTag,
      ];
      return complexTag;
    });
  }

  private transformNotesToNoteWithRelatedData(
    workflowNote: NoteEntity,
    relatedNotes: NoteEntity[],
    currentPipelineStageId: string,
  ): WorkflowNoteData {
    delete workflowNote.noteFieldGroups;

    const mappedNote = this.noteEntityToNoteData(workflowNote);

    const missingFields: { tabName: string; fieldName: string }[] = [];
    // we assume there is only one tab with given name and it won't change after being created from template
    for (const tab of workflowNote.template?.tabs || []) {
      const foundTab = mappedNote.noteTabs.find(
        (nt) => nt.name === tab.name,
      ) as NoteTabsWithRelatedNotesData;
      const relatedNotesCopy = cloneDeep(relatedNotes);
      if (foundTab) {
        foundTab.relatedNotesWithFields = this.getRelatedNotesWithFieldsForTab(
          tab,
          relatedNotesCopy,
        );
        foundTab.relatedNotes = this.getRelatedNotesForTab(
          tab,
          relatedNotesCopy,
        );
        foundTab.pipelineStages = tab.pipelineStages;
      }
      if (tab.pipelineStages.find((ps) => ps.id === currentPipelineStageId)) {
        const emptyFields =
          foundTab?.noteFieldGroups?.reduce(
            (
              res: NoteFieldData[],
              cur: NoteFieldGroupsWithFieldData,
            ): NoteFieldData[] => {
              const emptyFieldsInGroup = cur.noteFields.filter(
                (nf) => !nf.value,
              );
              res.push(...emptyFieldsInGroup);
              return res;
            },
            [],
          ) || [];
        missingFields.push(
          ...emptyFields.map((nf) => ({
            tabName: tab.name,
            fieldName: nf.name,
          })),
        );
      }
    }

    const fieldDefinitions =
      workflowNote.template?.tabs
        .flatMap((t) => t.fieldGroups)
        .flatMap((fg) => fg.fieldDefinitions) || [];
    for (const field of mappedNote.noteTabs
      .flatMap((nt) => nt.noteFieldGroups)
      .flatMap((nfg) => nfg.noteFields)) {
      const fieldDefinition = fieldDefinitions.find(
        (fd) => fd.id === field.templateFieldId,
      );
      if (fieldDefinition) {
        field.hideOnPipelineStages = fieldDefinition.hideOnPipelineStages;
      }
    }

    (mappedNote as WorkflowNoteData).missingFields = missingFields;
    return mappedNote as WorkflowNoteData;
  }

  private getRelatedNotesForTab(
    tab: TabEntity,
    relatedNotes: NoteEntity[],
  ): NoteData[] {
    const relatedTemplateIds = tab.relatedTemplates.map((rt) =>
      rt.id.toLowerCase(),
    );

    return relatedNotes
      .filter((rn) => {
        return relatedTemplateIds.includes(rn.templateId.toLowerCase());
      })
      .map((rn) => {
        delete rn.noteFieldGroups;
        delete rn.noteTabs;
        return rn; // we remove note fields data to make response smaller
      })
      .map(this.noteEntityToNoteData.bind(this));
  }

  private getRelatedNotesWithFieldsForTab(
    tab: TabEntity,
    relatedNotes: NoteEntity[],
  ): RelatedNoteWithFields[] {
    const relatedFieldsIds = tab.relatedFields.map((rf) => rf.id);

    const filteredRelatedNotes = relatedNotes.filter((rn) => {
      const noteFieldIds = rn.noteFieldGroups
        ? rn.noteFieldGroups
            .map((nfg) =>
              nfg.noteFields
                .filter(
                  (nf) =>
                    nf.value && relatedFieldsIds.includes(nf.templateFieldId),
                )
                .map((nf) => nf.templateFieldId.toLowerCase()),
            )
            .flat()
        : [];
      return noteFieldIds.length > 0;
    });
    filteredRelatedNotes.forEach((rn) => {
      rn.noteFieldGroups = rn.noteFieldGroups.filter((nfg) => {
        nfg.noteFields = nfg.noteFields.filter((nf) => {
          return nf.value && relatedFieldsIds.includes(nf.templateFieldId);
        });
        return nfg.noteFields.length > 0;
      });
    });

    return filteredRelatedNotes.map(this.mapNoteToRelatedNoteData.bind(this));
  }

  private mapNoteToRelatedNoteData(note: NoteEntity): RelatedNoteWithFields {
    return {
      id: note.id,
      name: note.name,
      createdById: note.createdBy?.id,
      createdBy: {
        name: note.createdBy?.name,
        email: note.createdBy?.email,
      },
      updatedById: note.updatedBy.id,
      updatedBy: {
        name: note.updatedBy.name,
        email: note.updatedBy.email,
      },
      templateName: note.template.name,
      fields: note.noteFieldGroups
        .map((nfg) => nfg.noteFields)
        .flat()
        .map(this.noteFieldEntityToNoteFieldData.bind(this)),
    };
  }

  private emitNoteCreatedEvent(note: NoteEntity): void {
    this.gatewayEventService.emit('resource-notes', {
      eventType: 'note-created',
      data: note.id,
    });
  }
  private emitNoteUpdatedEvent(note: NoteEntity): void {
    this.gatewayEventService.emit('resource-notes', {
      eventType: 'note-updated',
      data: { id: note.id, rootVersionId: note.rootVersionId },
    });
  }
  private emitNoteDeletedEvent(note: NoteEntity): void {
    this.gatewayEventService.emit('resource-notes', {
      eventType: 'note-deleted',
      data: note.id,
    });
  }
}
