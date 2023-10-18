import { NoteFieldData } from './note-field-data.interface';
import { NoteFieldGroupDataInterface } from './note-field-group-data.interface';

interface UserData {
  readonly name: string;
  readonly email: string;
}

// TODO expand when needed
interface NoteTagData {
  readonly name: string;
  readonly type: string;
}

export interface NoteData {
  readonly id: string;
  readonly name: string;
  readonly tags: NoteTagData[];
  readonly templateId?: string;
  readonly createdById: string;
  readonly createdBy: UserData;
  readonly updatedAt: Date;
  readonly updatedBy: UserData;
  readonly createdAt: Date;
  readonly updatedById: string;
}

interface NoteFieldGroupsWithFieldData extends NoteFieldGroupDataInterface {
  noteFields: NoteFieldData[];
}

export interface NoteWithRelationsData extends NoteData {
  noteFieldGroups: NoteFieldGroupsWithFieldData[];
}
