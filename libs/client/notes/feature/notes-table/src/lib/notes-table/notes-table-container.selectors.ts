import { notesQuery } from '@app/client/notes/data-access';
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

export const selectNotesTableViewModel = createSelector(
  notesQuery.selectNotesTableParams,
  selectNotesGridModel,

  (params, gridModel) => ({
    params,
    gridModel,
  }),
);
