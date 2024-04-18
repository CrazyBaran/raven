import { Injectable } from '@angular/core';
import { pipelinesQuery } from '@app/client/opportunities/api-pipelines';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { OrganisationsActions } from '@app/client/organisations/state';
import { NotificationsActions } from '@app/client/shared/util-notifications';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import * as _ from 'lodash';
import { CompanyStatus } from 'rvns-shared';
import { combineLatest, mergeMap, of, switchMap } from 'rxjs';
import { catchError, concatMap, filter, map } from 'rxjs/operators';
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

  private reopenOpportunity$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(OpportunitiesActions.reopenOpportunity),
      concatLatestFrom(({ id }) =>
        this.store.select(opportunitiesQuery.selectOpportunityById(id)),
      ),
      concatMap(([{ id, reopenAndDuplicate, versionName }, opportunity]) =>
        this.opportunitiesService
          .reopenOpportunity(id, reopenAndDuplicate, versionName)
          .pipe(
            switchMap(({ data }) => [
              OpportunitiesActions.reopenOpportunitySuccess({
                data: data!,
              }),
              NotificationsActions.showSuccessNotification({
                content: 'Opportunity reopened.',
              }),
            ]),
            catchError((error) =>
              of(
                OpportunitiesActions.reopenOpportunityFailure({
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
      concatLatestFrom(({ id }) =>
        this.store.select(opportunitiesQuery.selectOpportunityById(id)),
      ),
      concatMap(([{ id, pipelineStageId }, opportunity]) =>
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
                  id,
                  prevPipelineStageId: opportunity?.stage.id ?? '',
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
          content: `Opportunity ${opportunity?.organisation
            .name} pipeline stage changed to '${
            pipelineStage?.displayName ?? ''
          }'`,
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
      concatLatestFrom(() =>
        this.store.select(pipelinesQuery.selectAllPipelineStages),
      ),
      concatMap(([{ payload }, pipelineStages]) =>
        this.opportunitiesService
          .createOpportunity({
            organisationId: payload.organisationId,
            team: payload.team ?? {
              owners: [],
              members: [],
            },
          })
          .pipe(
            switchMap(({ data }) => {
              const returnActions = [];
              returnActions.push(
                NotificationsActions.showSuccessNotification({
                  content: 'Opportunity created successfully',
                }),
              );

              const shouldPatchOpportunity =
                Object.keys(_.omit(payload, 'organisationId')).length > 0;

              if (shouldPatchOpportunity) {
                returnActions.push(
                  OpportunitiesActions.updateOpportunity({
                    id: data?.id ?? '',
                    changes: {
                      pipelineStageId:
                        pipelineStages?.find(
                          (stage) =>
                            stage.relatedCompanyStatus ===
                            CompanyStatus.LIVE_OPPORTUNITY,
                        )?.id || undefined,
                      ..._.omit(payload, 'team'),
                    },
                  }),
                  OrganisationsActions.updateOrganisation({
                    id: data!.organisation.id!,
                    changes: {
                      companyStatus: null,
                    },
                  }),
                );
              }
              returnActions.push(
                OpportunitiesActions.createOpportunitySuccess({ data: data! }),
              );

              return returnActions;
            }),
            catchError((error) =>
              of(
                OpportunitiesActions.createOpportunityFailure({
                  error,
                }),
              ),
            ),
          ),
      ),
    );
  });

  private showAlreadyActiveItemInPipelineError$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(
        OpportunitiesActions.createOpportunityFailure,
        OpportunitiesActions.reopenOpportunityFailure,
        OpportunitiesActions.changeOpportunityPipelineStageFailure,
      ),
      filter(({ error }) => _.get(error, 'status') === 409),
      map(() => {
        return NotificationsActions.showErrorNotification({
          content:
            'There already is an active item in the pipeline for this organisation',
        });
      }),
    );
  });

  public constructor(
    private readonly actions$: Actions,
    private readonly opportunitiesService: OpportunitiesService,
    private readonly store: Store,
  ) {}
}
