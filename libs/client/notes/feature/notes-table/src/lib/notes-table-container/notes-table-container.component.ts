import {
  ChangeDetectionStrategy,
  Component,
  inject,
  ViewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NoteQueryParams } from '@app/client/notes/data-access';
import { NotesActions, notesQuery } from '@app/client/notes/state';
import { NotesTableComponent } from '@app/client/notes/ui';
import { distinctUntilChangedDeep } from '@app/client/shared/util-rxjs';
import { TemplateActions } from '@app/client/templates/data-access';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import * as _ from 'lodash';
import { debounceTime } from 'rxjs';
import { selectNotesGridModel } from './notes-table-container.selectors';

@Component({
  selector: 'app-notes-table-container',
  standalone: true,
  imports: [NotesTableComponent],
  templateUrl: './notes-table-container.component.html',
  styleUrls: ['./notes-table-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotesTableContainerComponent {
  @ViewChild(NotesTableComponent) public notesTable!: NotesTableComponent;

  protected actions = inject(Actions);
  protected store = inject(Store);

  protected gridModel = this.store.selectSignal(selectNotesGridModel);
  protected params = this.store.selectSignal(notesQuery.selectNotesTableParams);

  public constructor() {
    this.store.dispatch(NotesActions.openNotesTable());
    this.store.dispatch(TemplateActions.getTemplateIfNotLoaded());

    this.store
      .select(notesQuery.selectNotesTableParams)
      .pipe(distinctUntilChangedDeep(), takeUntilDestroyed())
      .subscribe((params) => {
        this.notesTable?.reset();
        this._loadNotes(params);
      });

    this.actions
      .pipe(
        takeUntilDestroyed(),
        ofType(NotesActions.liveCreateNote, NotesActions.createNoteSuccess),
        debounceTime(100),
      )
      .subscribe(() => {
        this.store.dispatch(NotesActions.refreshNotesTable());
      });
  }

  protected onLoadMore($event: { skip: number; take: number }): void {
    this._loadNotes(
      {
        ...this.params(),
        skip: '' + $event.skip,
        take: '' + $event.take,
      },
      false,
      true,
    );
  }

  private _loadNotes(
    params: NoteQueryParams,
    silently?: boolean,
    append?: boolean,
  ): void {
    this.store.dispatch(
      NotesActions.getNotes({
        params:
          params.dir === 'none'
            ? (_.omit(params, 'dir') as NoteQueryParams)
            : params,
        silently,
        append,
      }),
    );
  }
}
