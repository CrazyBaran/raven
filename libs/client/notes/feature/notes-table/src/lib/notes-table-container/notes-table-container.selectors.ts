import { authQuery } from '@app/client/core/auth';
import { notesQuery, selectTableNotes } from '@app/client/notes/state';
import { NoteTableRow } from '@app/client/notes/ui';
import { tagTypeStyleDictionary } from '@app/client/shared/ui';
import { TableViewModel } from '@app/client/shared/ui-directives';
import { NoteTagData } from '@app/rvns-notes/data-access';
import { TagType } from '@app/rvns-tags';
import { createSelector } from '@ngrx/store';

export const selectAllNotesTableRows = createSelector(
  selectTableNotes,
  authQuery.selectUserEmail,
  (notes, userEmail) =>
    notes.map((note): NoteTableRow => {
      const complexTags: NoteTagData[] =
        note.complexTags?.map((t) => ({
          id: t.id,
          name: `${[...t.tags]
            .sort((a, b) => (a.type !== 'company' ? 1 : -1))
            .map((t) => t.name)
            .join(' / ')}`,
          type: 'opportunity',
          organisationId: t.tags?.find((innerTag) => !!innerTag?.organisationId)
            ?.organisationId,
        })) ?? [];
      return {
        ...note,
        deleteButtonSettings: {
          disabled: note.createdBy?.email !== userEmail,
          tooltip:
            note.createdBy?.email !== userEmail
              ? 'You can only delete your own notes'
              : '',
        },
        peopleTags: note.tags
          .filter((t) => t.type === 'people')
          .sort((a, b) => a.name.length - b.name.length)
          .map((t) => ({
            name: t.name,
            id: t.id,
            style: { color: '#424242' },
            size: 'medium',
            icon: 'fa-solid fa-circle-user',
          })),
        tags: [...note.tags, ...complexTags]
          .filter((t) => t.type !== 'people')
          .sort((a, b) => a.name.length - b.name.length)
          .map((t) => ({
            name: t.name,
            id: t.id,
            style: tagTypeStyleDictionary[t.type as TagType] ?? '',
            size: 'small',
            icon: 'fa-solid fa-tag',
            link: t.organisationId ? ['/companies', t.organisationId] : null,
          })),
      };
    }),
);

export const selectNotesGridModel = createSelector(
  notesQuery.selectNotesTableParams,
  notesQuery.selectIsTableLoading,
  selectAllNotesTableRows,
  notesQuery.selectTotal,
  (params, isLoading, data, total): TableViewModel<NoteTableRow> => ({
    ...params,
    isLoading,
    data,
    total,
  }),
);
