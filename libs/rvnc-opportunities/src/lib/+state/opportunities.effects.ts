import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, concatMap, map } from 'rxjs/operators';
import { OpportunitiesService } from '../services/opportunities.service';
import { OpportunitiesActions } from './opportunities.actions';

@Injectable()
export class OpportunitiesEffects {
  private loadOpportunities$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(OpportunitiesActions.getOpportunities),
      concatMap(() =>
        /** An EMPTY observable only emits completion. Replace with your own observable API request */
        this.opportunitiesService.getOpportunities().pipe(
          map(({ data }) =>
            OpportunitiesActions.getOpportunitiesSuccess({ data: data || [] }),
          ),
          catchError((error) =>
            of(OpportunitiesActions.getOpportunitiesFailure({ error })),
          ),
        ),
      ),
    );
  });

  public constructor(
    private actions$: Actions,
    private opportunitiesService: OpportunitiesService,
  ) {}
}
