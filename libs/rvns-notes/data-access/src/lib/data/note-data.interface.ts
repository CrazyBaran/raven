import { NoteFieldData } from './note-field-data.interface';
import { NoteFieldGroupData } from './note-field-group-data.interface';
import { NoteTabData } from './note-tab-data.interface';

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
  readonly version: number;
  readonly tags: NoteTagData[];
  readonly templateId?: string;
  readonly templateName?: string;
  readonly createdById: string;
  readonly createdBy: UserData;
  readonly updatedAt: Date;
  readonly updatedBy: UserData;
  readonly createdAt: Date;
  readonly updatedById: string;
}

export interface NoteFieldGroupsWithFieldData extends NoteFieldGroupData {
  noteFields: NoteFieldData[];
}

interface NoteTabWithFieldGroupsData extends NoteTabData {
  noteFieldGroups: NoteFieldGroupsWithFieldData[];
}

export interface NoteWithRelationsData extends NoteData {
  noteTabs: NoteTabWithFieldGroupsData[];
  noteFieldGroups: NoteFieldGroupsWithFieldData[];
}
