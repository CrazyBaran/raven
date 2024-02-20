import { DialogQueryParams } from '@app/client/shared/shelf';
import { selectQueryParam } from '@app/client/shared/util-router';
import { createSelector } from '@ngrx/store';

export const selectAddToShortlistViewModel = createSelector(
  selectQueryParam(DialogQueryParams.createShortlist),
  (id) => {
    return {
      organisationId: id,
      shortlists: [
        {
          id: '1',
          name: 'Shortlist 1',
          description: 'Shortlist 1 description',
        },
        {
          id: '2',
          name: 'Shortlist 2',
          description: 'Shortlist 2 description',
        },
        {
          id: '3',
          name: 'Shortlist 3',
          description: 'Shortlist 3 description',
        },
      ],
    };
  },
);
