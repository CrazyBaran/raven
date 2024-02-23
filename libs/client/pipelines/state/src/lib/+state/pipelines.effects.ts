import { Injectable } from '@angular/core';
import { PipelinesService } from '@app/client/pipelines/data-access';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, concatMap, filter, map, of } from 'rxjs';
import { colorDictionary } from './pipeline-colors.constants';
import { PipelinesActions } from './pipelines.actions';
import { pipelinesQuery } from './pipelines.selectors';

export const getPipelineColors = (
  stage: { configuration?: unknown },
  index: number,
): {
  primaryColor: string;
  secondaryColor: string;
} => {
  if (stage.configuration) {
    return {
      primaryColor: '#D9D9D6',
      secondaryColor: '#D9D9D6',
    };
  }
  return colorDictionary[index % colorDictionary.length];
};

@Injectable()
export class PipelinesEffects {
  private loadPipelines$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(PipelinesActions.getPipelines),
      concatMap(() =>
        this.pipelinesService.getPipelines().pipe(
          map(({ data }) =>
            PipelinesActions.getPipelinesSuccess({
              data:
                data?.map((d) => ({
                  ...d,
                  stages: d.stages?.map((s, index) => ({
                    ...s,
                    ...getPipelineColors(s, index),
                  })),
                })) || [],
            }),
          ),
          catchError((error) =>
            of(PipelinesActions.getPipelinesFailure({ error })),
          ),
        ),
      ),
    );
  });

  private loadPipelinesIfNotLoaded$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(PipelinesActions.getPipelinesIfNotLoaded),
      concatLatestFrom(() =>
        this.store.select(pipelinesQuery.selectAllPipelineStages),
      ),
      filter(([, pipelines]) => !pipelines.length),
      map(() => PipelinesActions.getPipelines()),
    );
  });

  public constructor(
    private readonly store: Store,
    private readonly actions$: Actions,
    private readonly pipelinesService: PipelinesService,
  ) {}
}
