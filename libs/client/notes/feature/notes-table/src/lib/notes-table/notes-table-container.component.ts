import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NotesActions, notesQuery } from '@app/client/notes/data-access';
import { NotesTableComponent } from '@app/client/notes/ui';
import { selectRouteOpportunityDetails } from '@app/client/opportunities/data-access';
import { distinctUntilChangedDeep } from '@app/client/shared/util-rxjs';
import { getRouterSelectors } from '@ngrx/router-store';
import { Store, createSelector } from '@ngrx/store';
import * as _ from 'lodash';

export const selectNotesTableParams = createSelector(
  getRouterSelectors().selectQueryParams,
  getRouterSelectors().selectRouteParams,
  (queryParams, routeParams) =>
    _.pickBy(
      {
        ...(queryParams as Record<string, unknown>),
        ...(routeParams as Record<string, unknown>),
      } as _.Dictionary<unknown>,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (v: any, key: any) =>
        ['domain', 'tagIds', 'opportunityId', 'companyId', 'noteType'].includes(
          key,
        ),
    ) as Record<string, string>,
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
  selector: 'app-notes-table-container',
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
    this.tableParams$
      .pipe(takeUntilDestroyed(), distinctUntilChangedDeep())
      .subscribe((params) => {
        this.store.dispatch(NotesActions.getNotes({ ...params }));
      });
  }
}
