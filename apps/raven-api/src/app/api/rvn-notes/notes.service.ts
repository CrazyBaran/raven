import { NoteWithRelationsData } from '@app/rvns-notes';
import { FieldDefinitionType } from '@app/rvns-templates';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TemplateEntity } from '../rvn-templates/entities/template.entity';
import { UserEntity } from '../rvn-users/entities/user.entity';
import { NoteFieldGroupEntity } from './entities/note-field-group.entity';
import { NoteFieldEntity } from './entities/note-field.entity';
import { NoteEntity } from './entities/note.entity';

@Injectable()
export class NotesService {
  public constructor(
    @InjectRepository(NoteEntity)
    private readonly noteRepository: Repository<NoteEntity>,
  ) {}

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
    noteField.type = FieldDefinitionType.RichText;

    const noteFieldGroup = new NoteFieldGroupEntity();
    noteFieldGroup.name = 'Note';
    noteFieldGroup.order = 1;
    noteFieldGroup.createdBy = userEntity;
    noteFieldGroup.noteFields = [noteField];

    const note = new NoteEntity();
    note.name = 'Empty Note';
    note.version = 1;
    note.createdBy = userEntity;
    note.noteFieldGroups = [noteFieldGroup];

    return await this.noteRepository.save(note);
  }

  public noteEntityToNoteData(noteEntity: NoteEntity): NoteWithRelationsData {
    return {
      id: noteEntity.id,
      name: noteEntity.name,
      createdById: noteEntity.createdById,
      updatedAt: noteEntity.updatedAt,
      createdAt: noteEntity.createdAt,
      noteFieldGroups: noteEntity.noteFieldGroups.map((noteFieldGroup) => {
        return {
          id: noteFieldGroup.id,
          name: noteFieldGroup.name,
          order: noteFieldGroup.order,
          noteId: noteFieldGroup.noteId,
          createdById: noteFieldGroup.createdById,
          updatedAt: noteFieldGroup.updatedAt,
          createdAt: noteFieldGroup.createdAt,
          noteFields: noteFieldGroup.noteFields.map((noteField) => {
            return {
              id: noteField.id,
              name: noteField.name,
              type: noteField.type,
              order: noteField.order,
              value: noteField.value,
              noteGroupId: noteField.noteGroupId,
              createdById: noteField.createdById,
              updatedAt: noteField.updatedAt,
              createdAt: noteField.createdAt,
            };
          }),
        };
      }),
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
    note.noteFieldGroups = templateEntity.fieldGroups.map((fieldGroup) => {
      const noteFieldGroup = new NoteFieldGroupEntity();
      noteFieldGroup.name = fieldGroup.name;
      noteFieldGroup.order = fieldGroup.order;
      noteFieldGroup.createdBy = userEntity;

      noteFieldGroup.noteFields = fieldGroup.fieldDefinitions.map(
        (fieldDefinition) => {
          const noteField = new NoteFieldEntity();
          noteField.name = fieldDefinition.name;
          noteField.order = fieldDefinition.order;
          noteField.type = fieldDefinition.type;
          noteField.createdBy = userEntity;
          return noteField;
        },
      );
      return noteFieldGroup;
    });

    return await this.noteRepository.save(note);
  }
}
