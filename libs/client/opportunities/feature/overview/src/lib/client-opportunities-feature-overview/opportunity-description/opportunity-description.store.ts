import { inject } from '@angular/core';
import {
  OpportunitiesActions,
  OpportunitiesService,
} from '@app/client/opportunities/data-access';
import { StatusIndicatorState } from '@app/client/opportunities/ui';
import { tapResponse } from '@ngrx/component-store';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { Store } from '@ngrx/store';
import { pipe, switchMap, tap } from 'rxjs';

type OpportunityDescriptionState = {
  state: StatusIndicatorState;
  opportunityId: string | undefined;
};

export const opportunityDescriptionStore = signalStore(
  withState<OpportunityDescriptionState>({
    state: 'none',
    opportunityId: undefined,
  }),
  withMethods(
    (
      store,
      ngrxStore = inject(Store),
      opportunityService = inject(OpportunitiesService),
    ) => ({
      setOpportunityId: rxMethod<string>(
        tap((opportunityId) => patchState(store, { opportunityId })),
      ),
      updateOpportunityDescription: rxMethod<string | null>(
        pipe(
          tap(() => patchState(store, { state: 'validate' })),
          switchMap((description) =>
            opportunityService
              .patchOpportunity(store.opportunityId()!, {
                description: description ?? '',
              })
              .pipe(
                tapResponse({
                  next: (result) => {
                    patchState(store, { state: 'updated' });
                    ngrxStore.dispatch(
                      OpportunitiesActions.updateOpportunitySuccess({
                        data: result.data!,
                      }),
                    );
                  },
                  error: () => patchState(store, { state: 'failed' }),
                }),
              ),
          ),
        ),
      ),
    }),
  ),
);
