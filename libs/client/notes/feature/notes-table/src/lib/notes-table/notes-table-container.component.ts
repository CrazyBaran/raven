import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NotesActions, notesQuery } from '@app/client/notes/data-access';
import { NotesTableComponent } from '@app/client/notes/ui';
import { selectRouteOpportunityDetails } from '@app/client/opportunities/data-access';
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
  notesQuery.selectAllNotesTableRows,
  (params, notes) => notes,
);

export const selectNotesTableViewModel = createSelector(
  selectNotesTableParams,
  selectNotesByRouteParams,
  selectRouteOpportunityDetails,
  notesQuery.selectIsLoading,
  (params, notes, opportunity, isLoading) => ({
    params,
    isLoading,
    notes: notes.filter((n) => {
      if (
        params['companyId'] &&
        !n.tags.some((t) => t.organisationId === params['companyId'])
      ) {
        return false;
      }

      if (
        params['noteType'] &&
        n.templateName?.toLowerCase() !== params['noteType']?.toLowerCase()
      ) {
        return false;
      }

      // if (
      //   params['opportunityId'] &&
      //   n.tags.some((t) => t.type === 'opportunity' && t.name === '')
      // ) {
      //   todo: fix this
      //
      // return true;
      // }
      return true;
    }),
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
