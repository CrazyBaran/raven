import { notesQuery } from '@app/client/notes/state';
import { NoteTableRow } from '@app/client/notes/ui';
import { TableViewModel } from '@app/client/shared/ui-directives';
import { createSelector } from '@ngrx/store';

export const selectNotesGridModel = createSelector(
  notesQuery.selectNotesTableParams,
  notesQuery.selectIsTableLoading,
  notesQuery.selectAllNotesTableRows,
  notesQuery.selectTotal,
  (params, isLoading, data, total): TableViewModel<NoteTableRow> => ({
    ...params,
    isLoading,
    data,
    total,
  }),
);
