import { Injectable } from '@angular/core';
import { TemplateWithRelationsData } from '@app/rvns-templates';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { TemplateActions } from './templates.actions';
import { templateQueries } from './templates.selectors';

@Injectable()
export class TemplatesStoreFacade {
  public templates$: Observable<TemplateWithRelationsData[]> =
    this.store.select(templateQueries.selectAllTemplates);

  public templates = this.store.selectSignal(
    templateQueries.selectAllTemplates,
  );

  public defaultTemplate = this.store.selectSignal(
    templateQueries.selectDefaultTemplate,
  );

  public notesTemplates = this.store.selectSignal(
    templateQueries.selectAllNoteTemplates,
  );

  public defaultTemplate$ = this.store.select(
    templateQueries.selectDefaultTemplate,
  );

  public isLoading$: Observable<boolean> = this.store.select(
    templateQueries.selectTemplatesLoaded,
  );
  public loaded = this.store.selectSignal(
    templateQueries.selectTemplatesLoaded,
  );

  public constructor(private store: Store) {}

  public template$ = (
    id: string,
  ): Observable<TemplateWithRelationsData | undefined> =>
    this.store.select(templateQueries.selectTemplate(id));

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
