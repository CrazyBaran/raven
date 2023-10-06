import { AbstractEntityPipe } from '../../../shared/pipes/abstract-entity.pipe';
import { NoteFieldEntity } from '../entities/note-field.entity';

export class ParseNoteFieldPipe extends AbstractEntityPipe<NoteFieldEntity> {
  public readonly entityClass = NoteFieldEntity;
  public readonly resource = 'note-field';
}
