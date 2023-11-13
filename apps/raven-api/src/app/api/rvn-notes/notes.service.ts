import {
  NoteAttachmentData,
  NoteFieldData,
  NoteFieldGroupsWithFieldData,
  NoteWithRelatedNotesData,
  NoteWithRelationsData,
} from '@app/rvns-notes/data-access';
import { TagData } from '@app/rvns-tags';
import { FieldDefinitionType, TemplateTypeEnum } from '@app/rvns-templates';
import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OpportunityEntity } from '../rvn-opportunities/entities/opportunity.entity';
import { StorageAccountService } from '../rvn-storage-account/storage-account.service';
import { ComplexTagEntity } from '../rvn-tags/entities/complex-tag.entity';
import {
  OrganisationTagEntity,
  PeopleTagEntity,
  TagEntity,
} from '../rvn-tags/entities/tag.entity';
import { FieldDefinitionEntity } from '../rvn-templates/entities/field-definition.entity';
import { FieldGroupEntity } from '../rvn-templates/entities/field-group.entity';
import { TemplateEntity } from '../rvn-templates/entities/template.entity';
import { UserEntity } from '../rvn-users/entities/user.entity';
import { NoteFieldGroupEntity } from './entities/note-field-group.entity';
import { NoteFieldEntity } from './entities/note-field.entity';
import { NoteTabEntity } from './entities/note-tab.entity';
import { NoteEntity } from './entities/note.entity';
import { CompanyOpportunityTag } from './interfaces/company-opportunity-tag.interface';
import { NotesServiceLogger } from './notes-service.logger';

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
    private readonly storageAccountService: StorageAccountService,
    private readonly logger: NotesServiceLogger,
  ) {}

  public async getAllNotes(
    organisationTagEntity?: OrganisationTagEntity,
    tagEntities?: TagEntity[],
  ): Promise<NoteEntity[]> {
    const orgTagSubQuery = this.noteRepository
      .createQueryBuilder('note_with_tag')
      .select('note_with_tag.id')
      .innerJoin('note_with_tag.tags', 'tag')
      .where('tag.id = :orgTagId');

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
      .leftJoinAndMapOne('note.template', 'note.template', 'template')
      .where(`note.version = (${subQuery.getQuery()})`)
      .andWhere('note.deletedAt IS NULL');

    if (organisationTagEntity) {
      queryBuilder
        .andWhere(`note.id IN (${orgTagSubQuery.getQuery()})`)
        .setParameter('orgTagId', organisationTagEntity.id);
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

    queryBuilder.orderBy('note.createdAt', 'ASC');

    return await queryBuilder.getMany();
  }

  public async getAllNoteVersions(
    noteEntity: NoteEntity,
  ): Promise<NoteEntity[]> {
    return await this.noteRepository.find({
      where: { rootVersionId: noteEntity.rootVersionId },
      relations: [
        'createdBy',
        'updatedBy',
        'deletedBy',
        'tags',
        'template',
        'noteTabs',
        'noteTabs.noteFieldGroups',
        'noteTabs.noteFieldGroups.noteFields',
        'noteFieldGroups',
        'noteFieldGroups.noteFields',
      ],
    });
  }

  public async getNoteWithRelatedNotes(
    opportunityId: string,
  ): Promise<NoteWithRelatedNotesData> {
    const opportunity = await this.opportunityRepository.findOne({
      where: { id: opportunityId },
      relations: ['organisation', 'workflowNote'],
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

    const qb = this.noteRepository
      .createQueryBuilder('note')
      .leftJoinAndSelect('note.tags', 'tag')
      .where('tag.id = :organisationTagId', {
        organisationTagId: organisationTag.id,
      });

    if (opportunity.tag) {
      qb.andWhere('tag.id = :opportunityTagId', {
        opportunityTagId: opportunity.tag.id,
      });
    }
    const relatedNotes = await qb.getMany();

    console.log({ relatedNotes });

    // TODO take from opportunity!!!!
    const workflowNote = relatedNotes.find(
      (note) => note.template.type === TemplateTypeEnum.Workflow,
    );

    // TODO first filter by templateFieldId? or when transforming?
    // TODO transform data
    console.log({ relatedNotes });
    const transformed = this.transformNotesToNoteWithRelatedData(
      workflowNote,
      relatedNotes,
    );
    console.log({ transformed });
    return workflowNote;
  }

  // TODO make private and move?
  public transformNotesToNoteWithRelatedData(
    workflowNote: NoteEntity,
    relatedNotes: NoteEntity[],
  ): NoteWithRelatedNotesData {
    for (let tab of workflowNote.template.tabs) {
      console.log({ tab });
    }
    return workflowNote;
  }

  public async createNote(options: CreateNoteOptions): Promise<NoteEntity> {
    if (options.templateEntity) {
      return await this.createNoteFromTemplate(
        options.name,
        options.fields,
        options.tags,
        options.templateEntity,
        options.userEntity,
        null,
        options.rootVersionId,
        options.companyOpportunityTags,
      );
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

    return await this.noteRepository.save(note);
  }

  public async updateNote(
    noteEntity: NoteEntity,
    userEntity: UserEntity,
    options: UpdateNoteOptions,
  ): Promise<NoteEntity> {
    const latestVersion = await this.noteRepository
      .createQueryBuilder('note')
      .where('LOWER(note.rootVersionId) = LOWER(:rootVersionId)', {
        rootVersionId: noteEntity.rootVersionId,
      })
      .orderBy('note.version', 'DESC')
      .getOne();

    if (latestVersion.version !== noteEntity.version) {
      throw new ConflictException({
        message: 'Note is out of date',
        latestVersionId: latestVersion.id,
      });
    }
    if (options.templateEntity) {
      return await this.createNoteFromTemplate(
        options.name,
        options.fields,
        options.tags,
        options.templateEntity,
        userEntity,
        noteEntity.createdBy,
        noteEntity.rootVersionId,
        options.companyOpportunityTags,
        noteEntity.version + 1,
      );
    }

    const newNoteVersion = new NoteEntity();
    newNoteVersion.name = options.name || noteEntity.name;
    newNoteVersion.rootVersionId = noteEntity.rootVersionId;
    newNoteVersion.version = noteEntity.version + 1;
    newNoteVersion.tags = options.tags;
    newNoteVersion.complexTags = this.getComplexNoteTags(
      options.companyOpportunityTags,
    );
    newNoteVersion.template = noteEntity.template;
    newNoteVersion.templateId = noteEntity.templateId;
    newNoteVersion.previousVersion = noteEntity;
    newNoteVersion.createdBy = noteEntity.createdBy;
    newNoteVersion.updatedBy = userEntity;
    newNoteVersion.noteTabs = noteEntity.noteTabs.map((noteTab) => {
      const newNoteTab = new NoteTabEntity();
      newNoteTab.name = noteTab.name;
      newNoteTab.order = noteTab.order;
      newNoteTab.createdBy = noteTab.createdBy;
      newNoteTab.createdById = noteTab.createdById;
      newNoteTab.updatedBy = userEntity;
      newNoteTab.noteFieldGroups = noteTab.noteFieldGroups.map(
        this.getNewGroupsAndFieldsMapping(userEntity, newNoteVersion, options),
      );
      return newNoteTab;
    });
    newNoteVersion.noteFieldGroups = noteEntity.noteFieldGroups
      .filter((nfg) => !nfg.noteTabId)
      .map(
        this.getNewGroupsAndFieldsMapping(userEntity, newNoteVersion, options),
      );
    return await this.noteRepository.save(newNoteVersion);
  }

  public async updateNoteField(
    noteFieldEntity: NoteFieldEntity,
    options: UpdateNoteFieldOptions,
    userEntity: UserEntity,
  ): Promise<NoteFieldEntity> {
    noteFieldEntity.value = options.value;
    noteFieldEntity.updatedBy = userEntity;
    noteFieldEntity.updatedAt = new Date();
    return await this.noteFieldRepository.save(noteFieldEntity);
  }

  public async deleteNotes(
    noteEntities: NoteEntity[],
    userEntity: UserEntity,
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
  }

  public async getNoteAttachments(
    noteEntity: NoteEntity,
  ): Promise<NoteAttachmentData[]> {
    return await this.storageAccountService.getStorageAccountFiles(
      noteEntity.rootVersionId,
    );
  }

  public noteEntityToNoteData(noteEntity: NoteEntity): NoteWithRelationsData {
    return {
      id: noteEntity.id,
      name: noteEntity.name,
      version: noteEntity.version,
      rootVersionId: noteEntity.rootVersionId,
      templateName: noteEntity.template?.name,
      templateId: noteEntity.templateId,
      createdById: noteEntity.createdById,
      createdBy: {
        name: noteEntity.createdBy.name,
        email: noteEntity.createdBy.email,
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
      name: noteFieldEntity.name,
      type: noteFieldEntity.type,
      order: noteFieldEntity.order,
      value: noteFieldEntity.value,
      noteGroupId: noteFieldEntity.noteGroupId,
      createdById: noteFieldEntity.createdById,
      updatedById: noteFieldEntity.updatedById,
      updatedAt: noteFieldEntity.updatedAt,
      createdAt: noteFieldEntity.createdAt,
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
      newNoteFieldGroup.createdBy = noteFieldGroup.createdBy;
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
          newNoteField.createdBy = noteField.createdBy;
          newNoteField.createdById = noteField.createdById;
          newNoteField.updatedBy = userEntity;
          newNoteField.value = this.findFieldValue(noteField, options.fields);
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
}
