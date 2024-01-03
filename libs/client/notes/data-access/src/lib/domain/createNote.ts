import { NoteData } from '@app/rvns-notes/data-access';

export type PatchNote = {
  name?: string;
  templateId?: string;
  fields: {
    id?: string;
    rootId?: string;
    value: unknown;
  }[];
  tagIds: string[];
  companyOpportunityTags?: {
    organisationId: string;
    opportunityTagId: string;
  }[];
  origin?: NoteData;
  opportunityId?: string;
};

export type CreateNote = Pick<NoteData, 'templateId' | 'name'> &
  PatchNote & {
    rootVersionId?: string;
  };
