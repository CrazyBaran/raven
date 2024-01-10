import { authQuery } from '@app/client/core/auth';
import { notesQuery } from '@app/client/notes/state';
import { NotepadForm } from '@app/client/notes/ui';
import { routerQuery } from '@app/client/shared/util-router';
import {
  NoteFieldData,
  NoteFieldGroupsWithFieldData,
  NoteWithRelationsData,
} from '@app/rvns-notes/data-access';
import { TemplateWithRelationsData } from '@app/rvns-templates';
import { createSelector } from '@ngrx/store';
import { sortBy } from 'lodash';

export const selectNoteDetailsModel = createSelector(
  routerQuery.selectNoteDetailsId,
  notesQuery.selectNotesDictionary,
  (noteId, notesDictionary) => {
    if (!noteId) {
      throw new Error(
        'Note id is not defined. Please check the route query param: `note-details`.',
      );
    }

    const note = notesDictionary[noteId] as NoteWithRelationsData;

    if (!note) {
      return null;
    }

    return {
      ...note,
    };
  },
);
export const selectNoteDetailsForm = createSelector(
  selectNoteDetailsModel,
  (noteDetails) => createNotepadForm(noteDetails),
);

export const selectNoteDetailsDialogViewModel = createSelector(
  routerQuery.selectNoteDetailsId,
  notesQuery.selectNoteDetailsIsLoading,
  selectNoteDetailsModel,
  authQuery.selectUserName,
  authQuery.selectUserEmail,
  selectNoteDetailsForm,
  (noteId, isLoading, noteDetails, userName, userEmail, form) => ({
    noteId,
    isLoading,
    noteDetails: {
      ...noteDetails,
      tags: [
        ...(noteDetails?.tags ?? []),
        ...(noteDetails?.complexTags?.map((tag) => ({
          id: tag.id,
          name: tag.tags.map((t) => t.name).join(' / '),
          type: 'opportunity',
        })) ?? []),
      ],
    },
    form,
    canEditNote:
      noteDetails?.tags.some((t) => t.name === userName) ||
      noteDetails?.createdBy?.email === userEmail,
    ...prepareAllNotes(noteDetails?.noteFieldGroups ?? []),
  }),
);

function prepareAllNotes(notes: NoteFieldGroupsWithFieldData[]): {
  noteFields: NoteFieldData[];
  fields: {
    name: string;
    id: string;
  }[];
} {
  const noteFields = notes.reduce((res, curr) => {
    if (curr.noteFields.length) {
      return [...res, ...curr.noteFields];
    }
    return res;
  }, [] as NoteFieldData[]);

  const sortedFields = sortBy(noteFields, 'order').filter(
    (note) => note.value?.trim(),
  );

  return {
    noteFields: sortedFields ?? [],
    fields: sortedFields.map((field) => ({
      name: field.name,
      id: field.id,
    })),
  };
}

function createNotepadForm(
  note: NoteWithRelationsData | null,
): NotepadForm | null {
  if (!note) {
    return null;
  }

  return {
    template: {
      ...note,
      fieldGroups:
        note?.noteFieldGroups?.map((group) => ({
          ...group,
          fieldDefinitions: group.noteFields,
        })) ?? [],
      name: note?.templateName,
    } as unknown as TemplateWithRelationsData,
    notes: {},
    peopleTags:
      note?.tags?.filter((tag) => tag.type === 'people').map((tag) => tag.id) ||
      [],
    tags: [
      ...(note?.tags
        ?.filter((tag) => tag.type !== 'people')
        .map((tag) => tag.id) ?? []),
      ...(note?.complexTags?.map((tag) => ({
        opportunityTagId:
          tag.tags.find((t) => t.type === 'opportunity')?.id ?? '',
        organisationId: tag.tags.find((t) => t.type === 'company')?.id ?? '',
      })) ?? []),
    ],

    title: note?.name,
    rootVersionId: note?.rootVersionId,
  };
}
