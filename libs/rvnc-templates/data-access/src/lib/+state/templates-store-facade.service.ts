import { Injectable } from '@angular/core';
import { TemplateWithRelationsData } from '@app/rvns-templates';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { TemplateActions } from './templates.actions';
import { TemplateSelectors } from './templates.selectors';

@Injectable()
export class TemplatesStoreFacade {
  public templates$: Observable<TemplateWithRelationsData[]> =
    this.store.select(TemplateSelectors.selectAllTemplates);

  public isLoading$: Observable<boolean> = this.store.select(
    TemplateSelectors.selectTemplatesLoaded,
  );

  public constructor(private store: Store) {}

  public template$ = (
    id: string,
  ): Observable<TemplateWithRelationsData | undefined> =>
    this.store.select(TemplateSelectors.selectTemplate(id));

  public getTemplates(): void {
    this.store.dispatch(TemplateActions.getTemplates());
  }

  public getTemplatesIfNotLoaded(): void {
    this.store.dispatch(TemplateActions.getTemplateIfNotLoaded());
  }

  public getTemplate(id: string): void {
    this.store.dispatch(TemplateActions.getTemplate({ id }));
  }
}
