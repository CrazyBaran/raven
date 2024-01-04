import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NoteQueryParams } from '@app/client/notes/data-access';
import { NotesActions } from '@app/client/notes/state';
import { NotesTableComponent } from '@app/client/notes/ui';
import { distinctUntilChangedDeep } from '@app/client/shared/util-rxjs';
import { TemplateActions } from '@app/client/templates/data-access';
import { Actions, concatLatestFrom, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import * as _ from 'lodash';
import { map } from 'rxjs';
import { selectNotesTableViewModel } from './notes-table-container.selectors';

@Component({
  selector: 'app-notes-table-container',
  standalone: true,
  imports: [NotesTableComponent],
  templateUrl: './notes-table-container.component.html',
  styleUrls: ['./notes-table-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotesTableContainerComponent {
  protected store = inject(Store);
  protected actions = inject(Actions);

  protected vm = this.store.selectSignal(selectNotesTableViewModel);

  public constructor() {
    this.store
      .select(selectNotesTableViewModel)
      .pipe(
        map(({ params }) => params),
        distinctUntilChangedDeep(),
        takeUntilDestroyed(),
      )
      .subscribe((params) => {
        this._loadNotes(params);
      });

    this.actions
      .pipe(
        takeUntilDestroyed(),
        ofType(NotesActions.liveCreateNote),
        concatLatestFrom(() => this.store.select(selectNotesTableViewModel)),
      )
      .subscribe(([action, { params }]) => {
        this._loadNotes(params, true);
      });

    this.store.dispatch(NotesActions.openNotesTable());
    this.store.dispatch(TemplateActions.getTemplateIfNotLoaded());
  }

  private _loadNotes(params: NoteQueryParams, silently?: boolean): void {
    this.store.dispatch(
      NotesActions.getNotes({
        params:
          params.dir === 'none'
            ? (_.omit(params, 'dir') as NoteQueryParams)
            : params,
        silently,
      }),
    );
  }
}
