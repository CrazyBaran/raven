import { shortlistsQuery } from '@app/client/shortlists/state';
import { createSelector } from '@ngrx/store';

export const selectCreateShortlistViewModel = createSelector(
  shortlistsQuery.selectLoadingStates,
  ({ create: isCreating }) => {
    return {
      isCreating,
    };
  },
);
