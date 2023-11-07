import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NotesActions, notesQuery } from '@app/client/notes/data-access';
import { NotesTableComponent } from '@app/client/notes/ui';
import { getRouterSelectors } from '@ngrx/router-store';
import { Store, createSelector } from '@ngrx/store';

export const selectNotesTableParams = createSelector(
  getRouterSelectors().selectQueryParams,
  getRouterSelectors().selectRouteParams,
  (queryParams, routeParams) => ({
    ...queryParams,
    ...routeParams,
  }),
);

export const selectNotesByRouteParams = createSelector(
  selectNotesTableParams,
  notesQuery.selectAllNotes,
  (params, notes) => notes,
);

export const selectNotesTableViewModel = createSelector(
  selectNotesTableParams,
  selectNotesByRouteParams,
  (params, notes) => ({
    params,
    notes,
  }),
);

@Component({
  selector: 'app-client-notes-feature-notes-table',
  standalone: true,
  imports: [CommonModule, NotesTableContainerComponent, NotesTableComponent],
  templateUrl: './notes-table-container.component.html',
  styleUrls: ['./notes-table-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotesTableContainerComponent {
  protected store = inject(Store);

  protected tableParams$ = this.store.select(selectNotesTableParams);

  protected vm = this.store.selectSignal(selectNotesTableViewModel);

  public constructor() {
    this.tableParams$.pipe(takeUntilDestroyed()).subscribe((params) => {
      this.store.dispatch(NotesActions.getNotes({ ...params }));
    });
  }
}
