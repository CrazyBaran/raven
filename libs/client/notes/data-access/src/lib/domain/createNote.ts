import { NoteData } from '@app/rvns-notes/data-access';

export type PatchNote = {
  name?: string;
  templateId?: string;
  fields: {
    id: string;
    value: unknown;
  }[];
  tagIds: string[];
};

export type CreateNote = Pick<NoteData, 'templateId' | 'name'> &
  PatchNote & {
    rootVersionId?: string;
  };
