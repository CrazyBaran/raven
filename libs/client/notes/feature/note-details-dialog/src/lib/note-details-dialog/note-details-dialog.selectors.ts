import { authQuery } from '@app/client/core/auth';
import { notesQuery } from '@app/client/notes/state';
import { NotepadForm } from '@app/client/notes/ui';
import {
  AzureImageEntity,
  storageQuery,
} from '@app/client/shared/storage/data-access';
import { populateAzureImages } from '@app/client/shared/ui-pipes';
import { routerQuery } from '@app/client/shared/util-router';
import {
  NoteFieldData,
  NoteFieldGroupsWithFieldData,
  NoteWithRelationsData,
} from '@app/rvns-notes/data-access';
import { TemplateWithRelationsData } from '@app/rvns-templates';
import { Dictionary } from '@ngrx/entity';
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
  storageQuery.selectAzureImageDictionary,
  (noteDetails, azureImageDictionary) =>
    createNotepadForm(noteDetails, azureImageDictionary),
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
        ...(noteDetails?.tags?.map((tag) => {
          return {
            ...tag,
            link:
              tag?.type === 'company'
                ? ['/companies', tag.organisationId]
                : null,
          };
        }) ?? []),
        ...(noteDetails?.complexTags?.map((tag) => {
          const organisationTag = tag?.tags?.filter(
            (t) => t?.type === 'company',
          )?.[0];
          return {
            id: tag.id,
            name: [...tag.tags]
              .sort((a, b) => (a.type !== 'company' ? 1 : -1))
              .map((t) => t.name)
              .join(' / '),
            type: 'opportunity',
            link: organisationTag?.organisationId
              ? ['/companies', organisationTag?.organisationId]
              : null,
          };
        }) ?? []),
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
  azureImageDictionary: Dictionary<AzureImageEntity>,
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
          fieldDefinitions: group.noteFields.map((field) => ({
            ...field,
            value: populateAzureImages(field.value, azureImageDictionary),
          })),
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
      ...(note?.complexTags?.map((tag) => {
        const organisationId =
          tag.tags.find((t) => t.type === 'company')?.id ?? '';
        const opportunityTagId = tag.tags.find((t) => t.type === 'opportunity')
          ?.id;
        const versionTagId = tag.tags.find((t) => t.type === 'version')?.id;
        return opportunityTagId
          ? { organisationId, opportunityTagId }
          : {
              organisationId,
              versionTagId: versionTagId!,
            };
      }) ?? []),
    ],

    title: note?.name,
    rootVersionId: note?.rootVersionId,
  };
}
