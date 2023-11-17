import { TemplateTypeEnum } from '@app/rvns-templates';
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

export interface ComplexTagData {
  readonly id: string;
  readonly tags: NoteTagData[];
}

export interface NoteData {
  readonly id: string;
  readonly name: string;
  readonly version: number;
  readonly rootVersionId: string;
  readonly tags: NoteTagData[];
  readonly complexTags?: ComplexTagData[];
  readonly templateId?: string;
  readonly templateName?: string;
  readonly templateType?: TemplateTypeEnum;
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
  readonly noteFields: NoteFieldData[];
}

interface NoteTabWithFieldGroupsData extends NoteTabData {
  readonly noteFieldGroups: NoteFieldGroupsWithFieldData[];
}

export interface RelatedNoteWithFields {
  readonly id: string;
  readonly name: string;
  readonly createdById: string;
  readonly createdBy: UserData;
  readonly fields: NoteFieldData[];
}

export interface NoteTabsWithRelatedNotesData
  extends NoteTabWithFieldGroupsData {
  relatedNotesWithFields?: RelatedNoteWithFields[];
  relatedNotes?: NoteData[];
  pipelineStages?: unknown[];
}

export interface NoteWithRelationsData<T = NoteTabWithFieldGroupsData>
  extends NoteData {
  noteTabs: T[];
  noteFieldGroups: NoteFieldGroupsWithFieldData[];
}

export type NoteWithRelatedNotesData =
  NoteWithRelationsData<NoteTabsWithRelatedNotesData>;

export interface NoteAttachmentData {
  readonly fileName: string;
  readonly url: string;
}
