import { authQuery } from '@app/client/core/auth';
import { notesQuery } from '@app/client/notes/data-access';
import { NotepadForm } from '@app/client/notes/ui';
import {
  AzureImageEntity,
  storageQuery,
} from '@app/client/shared/storage/data-access';
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

export const mapImageValues = (
  noteFieldGroups: NoteFieldGroupsWithFieldData[],
  azureImageDictioanry: Dictionary<AzureImageEntity>,
): NoteFieldGroupsWithFieldData[] => {
  return (
    noteFieldGroups?.map((fields) => ({
      ...fields,
      noteFields: fields.noteFields.map((field) => ({
        ...field,
        value: Object.entries(azureImageDictioanry).reduce(
          (acc, [file, iamge]) => acc.replace(file, iamge?.url ?? ''),
          field.value ?? '',
        ),
      })),
    })) ?? []
  );
};

export const selectNoteDetailsModel = createSelector(
  routerQuery.selectNoteDetailsId,
  notesQuery.selectNotesDictionary,
  storageQuery.selectAzureImageDictionary,
  (noteId, notesDictionary, azureImageDictioanry) => {
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
      noteFieldGroups: mapImageValues(
        note?.noteFieldGroups ?? [],
        azureImageDictioanry,
      ),
    };
  },
);

export const selectNoteDetailsDialogViewModel = createSelector(
  routerQuery.selectNoteDetailsId,
  notesQuery.selectNoteDetailsIsLoading,
  selectNoteDetailsModel,
  authQuery.selectUserName,
  authQuery.selectUserEmail,
  (noteId, isLoading, noteDetails, userName, userEmail) => ({
    noteId,
    isLoading,
    noteDetails,
    form: createNotepadForm(noteDetails),
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

  const sortedFields = sortBy(noteFields, 'order').filter((note) =>
    note.value.trim(),
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
      fieldGroups: note?.noteFieldGroups.map((group) => ({
        ...group,
        fieldDefinitions: group.noteFields,
      })),
      name: note?.templateName,
    } as unknown as TemplateWithRelationsData,
    notes: {},
    peopleTags:
      note?.tags?.filter((tag) => tag.type === 'people').map((tag) => tag.id) ||
      [],
    tags:
      note?.tags?.filter((tag) => tag.type !== 'people').map((tag) => tag.id) ||
      [],
    title: note?.name,
    rootVersionId: note?.rootVersionId,
  };
}
