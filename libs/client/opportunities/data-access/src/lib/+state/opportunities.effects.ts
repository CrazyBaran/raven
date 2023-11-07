import { Injectable } from '@angular/core';
import { NotificationsActions } from '@app/client/shared/util-notifications';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of, switchMap } from 'rxjs';
import { catchError, concatMap, map } from 'rxjs/operators';
import { OpportunitiesService } from '../services/opportunities.service';
import { OpportunitiesActions } from './opportunities.actions';

@Injectable()
export class OpportunitiesEffects {
  private loadOpportunities$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(OpportunitiesActions.getOpportunities),
      concatMap(({ take, skip }) =>
        this.opportunitiesService.getOpportunities(take, skip).pipe(
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

  private updateOpportunityPipeline$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(OpportunitiesActions.changeOpportunityPipelineStage),
      concatMap(({ id, pipelineStageId }) =>
        this.opportunitiesService
          .patchOpportunity(id, { pipelineStageId })
          .pipe(
            switchMap(({ data }) => [
              OpportunitiesActions.changeOpportunityPipelineStageSuccess({
                data: data || null,
              }),
              NotificationsActions.showSuccessNotification({
                content: 'Opportunity pipeline stage changed successfully',
              }),
            ]),
            catchError((error) =>
              of(
                OpportunitiesActions.changeOpportunityPipelineStageFailure({
                  error,
                }),
              ),
            ),
          ),
      ),
    );
  });

  private loadOpportunityDetails$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(OpportunitiesActions.getOpportunityDetails),
      concatMap(({ id }) =>
        this.opportunitiesService.getOpportunityDetails(id).pipe(
          map(({ data }) =>
            OpportunitiesActions.getOpportunityDetailsSuccess({
              data: data || null,
            }),
          ),
          catchError((error) =>
            of(OpportunitiesActions.getOpportunityDetailsFailure({ error })),
          ),
        ),
      ),
    );
  });

  public constructor(
    private readonly actions$: Actions,
    private readonly opportunitiesService: OpportunitiesService,
  ) {}
}
