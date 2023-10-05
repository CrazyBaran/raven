import { NoteFieldData } from './note-field-data.interface';
import { NoteFieldGroupDataInterface } from './note-field-group-data.interface';

export interface NoteData {
  readonly id: string;
  readonly name: string;
  readonly createdById: string;
  readonly updatedAt: Date;
  readonly createdAt: Date;
}

interface NoteFieldGroupsWithFieldData extends NoteFieldGroupDataInterface {
  noteFields: NoteFieldData[];
}

export interface NoteWithRelationsData extends NoteData {
  noteFieldGroups: NoteFieldGroupsWithFieldData[];
}
