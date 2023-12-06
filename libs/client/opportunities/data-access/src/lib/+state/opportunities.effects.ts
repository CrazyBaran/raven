import { Injectable } from '@angular/core';
import { pipelinesQuery } from '@app/client/opportunities/api-pipelines';
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
      concatMap(({ params }) =>
        this.opportunitiesService.getOpportunities(params).pipe(
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

  private updateOpportunity$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(OpportunitiesActions.updateOpportunity),
      concatMap(({ id, changes }) =>
        this.opportunitiesService.patchOpportunity(id, changes).pipe(
          switchMap(({ data }) => [
            OpportunitiesActions.updateOpportunitySuccess({
              data: data!,
            }),
            NotificationsActions.showSuccessNotification({
              content: 'Opportunity changed.',
            }),
          ]),
          catchError((error) =>
            of(
              OpportunitiesActions.updateOpportunityFailure({
                error,
              }),
            ),
          ),
        ),
      ),
    );
  });

  private updateOpportunityTeam$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(OpportunitiesActions.updateOpportunityTeam),
      concatMap(({ id, payload, method }) =>
        (method === 'post'
          ? this.opportunitiesService.createOpportunityTeam(id, payload)
          : this.opportunitiesService.patchOpportunityTeam(id, payload)
        ).pipe(
          switchMap(({ data }) => [
            OpportunitiesActions.updateOpportunityTeamSuccess({
              data: data!,
              id,
            }),
            NotificationsActions.showSuccessNotification({
              content: 'Opportunity team changed.',
            }),
          ]),
          catchError((error) =>
            of(
              OpportunitiesActions.updateOpportunityTeamFailure({
                error,
              }),
              NotificationsActions.showErrorNotification({
                content: 'Opportunity team change failed.',
              }),
            ),
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

  private createOpportunity$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(OpportunitiesActions.createOpportunity),
      concatMap(({ payload }) =>
        this.opportunitiesService.createOpportunity(payload).pipe(
          switchMap(({ data }) => [
            OpportunitiesActions.createOpportunitySuccess({ data: data! }),
            NotificationsActions.showSuccessNotification({
              content: 'Opportunity created successfully',
            }),
          ]),
          catchError((error) =>
            of(OpportunitiesActions.createOpportunityFailure({ error })),
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
