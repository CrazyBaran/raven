import { AbstractEntityPipe } from '../../../shared/pipes/abstract-entity.pipe';
import { NoteFieldGroupEntity } from '../entities/note-field-group.entity';

export class ParseNoteFieldGroupPipe extends AbstractEntityPipe<NoteFieldGroupEntity> {
  public readonly entityClass = NoteFieldGroupEntity;
  public readonly resource = 'note-field-group';
}
