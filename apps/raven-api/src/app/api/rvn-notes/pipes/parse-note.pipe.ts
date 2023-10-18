import { AbstractEntityPipe } from '../../../shared/pipes/abstract-entity.pipe';
import { NoteEntity } from '../entities/note.entity';

export class ParseNotePipe extends AbstractEntityPipe<NoteEntity> {
  public readonly entityClass = NoteEntity;
  public readonly resource = 'note';
  public readonly relations = [
    'createdBy',
    'updatedBy',
    'tags',
    'noteTabs',
    'noteTabs.noteFieldGroups',
    'noteTabs.noteFieldGroups.noteFields',
    'noteFieldGroups',
    'noteFieldGroups.noteFields',
  ];
}
