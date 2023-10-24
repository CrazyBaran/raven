import { NoteFieldData } from './note-field-data.interface';
import { NoteFieldGroupData } from './note-field-group-data.interface';
import { NoteTabData } from './note-tab-data.interface';

interface UserData {
  readonly name: string;
  readonly email: string;
}

// TODO expand when needed
export interface NoteTagData {
  readonly id: string;
  readonly name: string;
  readonly type: string;
  readonly userId?: string;
  readonly organisationId?: string;
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
  readonly deletedAt?: Date;
  readonly deletedBy?: UserData;
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
