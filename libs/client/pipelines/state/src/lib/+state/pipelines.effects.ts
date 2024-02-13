import { Injectable } from '@angular/core';
import { PipelinesService } from '@app/client/pipelines/data-access';
import { PipelineStageData } from '@app/rvns-pipelines';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, concatMap, map, of } from 'rxjs';
import { colorDictionary } from './pipeline-colors.constants';
import { PipelinesActions } from './pipelines.actions';

export const getPipelineColors = (
  stage: PipelineStageData,
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

  public constructor(
    private readonly actions$: Actions,
    private readonly pipelinesService: PipelinesService,
  ) {}
}
