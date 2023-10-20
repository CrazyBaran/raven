import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, concatMap, map, of } from 'rxjs';
import { TemplateService } from '../template.service';
import { TemplateActions } from './templates.actions';

@Injectable()
export class TemplatesEffects {
  private actions$ = inject(Actions);

  private loadTemplates$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TemplateActions.getTemplates),
      concatMap(() =>
        this.templateService.getTemplates().pipe(
          map(({ data }) =>
            TemplateActions.getTemplatesSuccess({ data: data || [] }),
          ),
          catchError((error) =>
            of(TemplateActions.getTemplatesFailure({ error })),
          ),
        ),
      ),
      catchError((error) => {
        console.error('Error', error);
        return of(TemplateActions.getTemplatesFailure({ error }));
      }),
    ),
  );

  private loadTemplate$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TemplateActions.getTemplate),
      concatMap(({ id }) =>
        this.templateService.getTemplate(id).pipe(
          map(({ data }) =>
            TemplateActions.getTemplateSuccess({ data: data! }),
          ),
          catchError((error) =>
            of(TemplateActions.getTemplateFailure({ error })),
          ),
        ),
      ),
      catchError((error) => {
        console.error('Error', error);
        return of(TemplateActions.getTemplateFailure({ error }));
      }),
    ),
  );

  public constructor(private templateService: TemplateService) {}
}
