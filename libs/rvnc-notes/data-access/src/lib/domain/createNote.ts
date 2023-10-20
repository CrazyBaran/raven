import { NoteData } from '@app/rvns-notes/data-access';

export type CreateNote = Pick<NoteData, 'tags' | 'templateId' | 'name'>;

export type PatchNote = {
  fields: {
    id: string;
    value: string;
  }[];
  tagIds: string[];
};
