import { Injectable, inject } from '@angular/core';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, concatMap, filter, map, of } from 'rxjs';
import { TemplateService } from '../template.service';
import { TemplateActions } from './templates.actions';
import { templateQueries } from './templates.selectors';

@Injectable()
export class TemplatesEffects {
  private actions$ = inject(Actions);
  private store = inject(Store);

  private getTemplateIfNotLoaded$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TemplateActions.getTemplateIfNotLoaded),
      concatLatestFrom(() =>
        this.store.select(templateQueries.selectAllTemplates),
      ),
      filter(([, templates]) => !templates.length),
      map(() => TemplateActions.getTemplates()),
    ),
  );

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
