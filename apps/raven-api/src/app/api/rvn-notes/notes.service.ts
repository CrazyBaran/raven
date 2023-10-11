import { NoteFieldData, NoteWithRelationsData } from '@app/rvns-notes';
import { FieldDefinitionType } from '@app/rvns-templates';
import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { NoteAssignedToAffinityOpportunityEvent } from '../rvn-opportunities/events/note-assigned-to-affinity-opportunity.event';
import { TemplateEntity } from '../rvn-templates/entities/template.entity';
import { UserEntity } from '../rvn-users/entities/user.entity';
import { NoteFieldGroupEntity } from './entities/note-field-group.entity';
import { NoteFieldEntity } from './entities/note-field.entity';
import { NoteEntity } from './entities/note.entity';

interface UpdateNoteFieldOptions {
  value: string;
}

interface UpdateNoteOptions {
  opportunityId?: string;
  opportunityAffinityInternalId?: number;
}

@Injectable()
export class NotesService {
  public constructor(
    @InjectRepository(NoteEntity)
    private readonly noteRepository: Repository<NoteEntity>,
    @InjectRepository(NoteFieldEntity)
    private readonly noteFieldRepository: Repository<NoteFieldEntity>,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  public async getAllNotes(oppportunityIds?: string[]): Promise<NoteEntity[]> {
    const where = oppportunityIds ? { opportunityId: In(oppportunityIds) } : {};
    return this.noteRepository.find({
      where,
      relations: ['noteFieldGroups', 'noteFieldGroups.noteFields'],
    });
  }

  public async createNote(
    userEntity: UserEntity,
    templateEntity: TemplateEntity | null,
  ): Promise<NoteEntity> {
    if (templateEntity) {
      return await this.createNoteFromTemplate(templateEntity, userEntity);
    }

    const noteField = new NoteFieldEntity();
    noteField.name = 'Note';
    noteField.order = 1;
    noteField.createdBy = userEntity;
    noteField.updatedBy = userEntity;
    noteField.type = FieldDefinitionType.RichText;

    const noteFieldGroup = new NoteFieldGroupEntity();
    noteFieldGroup.name = 'New Note Group';
    noteFieldGroup.order = 1;
    noteFieldGroup.createdBy = userEntity;
    noteFieldGroup.updatedBy = userEntity;
    noteFieldGroup.noteFields = [noteField];

    const note = new NoteEntity();
    note.name = 'New Note';
    note.version = 1;
    note.createdBy = userEntity;
    note.updatedBy = userEntity;
    note.noteFieldGroups = [noteFieldGroup];

    return await this.noteRepository.save(note);
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

  public async updateNote(
    noteEntity: NoteEntity,
    userEntity: UserEntity,
    options: UpdateNoteOptions,
  ): Promise<NoteEntity> {
    if (options.opportunityId) {
      noteEntity.opportunityId = options.opportunityId;
      noteEntity.updatedBy = userEntity;
      noteEntity.updatedAt = new Date();
      delete noteEntity.noteFieldGroups;
      return await this.noteRepository.save(noteEntity);
    } else if (options.opportunityAffinityInternalId) {
      this.eventEmitter.emit(
        `note.assigned.affinity-opportunity`,
        new NoteAssignedToAffinityOpportunityEvent(
          noteEntity,
          options.opportunityAffinityInternalId,
          userEntity,
        ),
      );
      return noteEntity;
    }
  }

  public noteEntityToNoteData(noteEntity: NoteEntity): NoteWithRelationsData {
    return {
      id: noteEntity.id,
      name: noteEntity.name,
      opportunityId: noteEntity.opportunityId,
      createdById: noteEntity.createdById,
      updatedById: noteEntity.updatedById,
      updatedAt: noteEntity.updatedAt,
      createdAt: noteEntity.createdAt,
      noteFieldGroups: noteEntity.noteFieldGroups?.map((noteFieldGroup) => {
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

  private async createNoteFromTemplate(
    templateEntity: TemplateEntity,
    userEntity: UserEntity,
  ): Promise<NoteEntity> {
    const note = new NoteEntity();
    note.name = templateEntity.name;
    note.version = 1;
    note.createdBy = userEntity;
    note.updatedBy = userEntity;
    note.noteFieldGroups = templateEntity.fieldGroups.map((fieldGroup) => {
      const noteFieldGroup = new NoteFieldGroupEntity();
      noteFieldGroup.name = fieldGroup.name;
      noteFieldGroup.order = fieldGroup.order;
      noteFieldGroup.createdBy = userEntity;
      noteFieldGroup.updatedBy = userEntity;

      noteFieldGroup.noteFields = fieldGroup.fieldDefinitions.map(
        (fieldDefinition) => {
          const noteField = new NoteFieldEntity();
          noteField.name = fieldDefinition.name;
          noteField.order = fieldDefinition.order;
          noteField.type = fieldDefinition.type;
          noteField.createdBy = userEntity;
          noteField.updatedBy = userEntity;
          return noteField;
        },
      );
      return noteFieldGroup;
    });

    return await this.noteRepository.save(note);
  }
}
