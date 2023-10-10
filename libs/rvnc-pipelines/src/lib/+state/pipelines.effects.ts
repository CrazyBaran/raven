import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, concatMap, map, of } from 'rxjs';
import { PipelinesService } from '../services/pipelines.service';
import { PipelinesActions } from './pipelines.actions';

@Injectable()
export class PipelinesEffects {
  private loadPipelines$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(PipelinesActions.getPipelines),
      concatMap(() =>
        this.pipelinesService.getPipelines().pipe(
          map(({ data }) =>
            PipelinesActions.getPipelinesSuccess({ data: data || [] }),
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
