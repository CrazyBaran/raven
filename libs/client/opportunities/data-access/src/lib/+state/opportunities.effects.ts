import { Injectable } from '@angular/core';
import { pipelinesQuery } from '@app/client/pipelines/state';
import { NotificationsActions } from '@app/client/shared/util-notifications';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { combineLatest, filter, mergeMap, of, switchMap } from 'rxjs';
import { catchError, concatMap, map } from 'rxjs/operators';
import { OpportunitiesService } from '../services/opportunities.service';
import { OpportunitiesActions } from './opportunities.actions';
import { opportunitiesQuery } from './opportunities.selectors';

@Injectable()
export class OpportunitiesEffects {
  private loadOpportunities$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(OpportunitiesActions.getOpportunities),
      concatMap(({ take, skip }) =>
        this.opportunitiesService.getOpportunities(take, skip).pipe(
          map(({ data }) =>
            OpportunitiesActions.getOpportunitiesSuccess({
              data: data?.items || [],
            }),
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

  private liveUpdateOpportunityPipeline$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(OpportunitiesActions.liveChangeOpportunityPipelineStage),
      concatLatestFrom(({ id, pipelineStageId }) =>
        combineLatest({
          opportunity: this.store.select(
            opportunitiesQuery.selectOpportunityById(id),
          ),
          pipelineStage: this.store.select(
            pipelinesQuery.selectPipelineById(pipelineStageId),
          ),
        }),
      ),
      filter(([{ pipelineStageId }, { opportunity }]) => {
        return opportunity?.stage.id !== pipelineStageId;
      }),
      mergeMap(([{ id, pipelineStageId }, { opportunity, pipelineStage }]) => [
        NotificationsActions.showSuccessNotification({
          content: `Opportunity ${opportunity?.organisation.name} pipeline stage changed to ${pipelineStage?.name}`,
        }),
        OpportunitiesActions.liveChangeOpportunityPipelineStageUpdated({
          id,
          pipelineStageId,
        }),
      ]),
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
    private readonly store: Store,
  ) {}
}
