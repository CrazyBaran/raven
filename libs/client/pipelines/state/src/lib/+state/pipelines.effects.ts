import { Injectable } from '@angular/core';
import { PipelinesService } from '@app/client/pipelines/data-access';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, concatMap, map, of } from 'rxjs';
import { colorDictionary } from './pipeline-colors.constants';
import { PipelinesActions } from './pipelines.actions';

export const getPipelineColors = (
  stage: { displayName: string },
  index: number,
): {
  primaryColor: string;
  secondaryColor: string;
} => {
  const name = stage.displayName.toLowerCase();
  if (['passed', 'lost'].some((n) => name.includes(n))) {
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