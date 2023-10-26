import { NoteData } from '@app/rvns-notes/data-access';

export type PatchNote = {
  fields: {
    id: string;
    value: string;
  }[];
  tagIds: string[];
};

export type CreateNote = Pick<NoteData, 'templateId' | 'name'> &
  PatchNote & {
    rootVersionId?: string;
  };
