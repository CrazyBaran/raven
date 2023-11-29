import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { notesQuery } from '@app/client/notes/data-access';
import { NotesTableContainerComponent } from '@app/client/notes/feature/notes-table';
import {
  NoteDetailsComponent,
  NotesTableComponent,
  QuickFiltersComponent,
} from '@app/client/notes/ui';
import { ShelfActions, ShelfStoreFacade } from '@app/client/shared/shelf';
import { HeaderComponent, LoaderComponent } from '@app/client/shared/ui';
import {
  ButtongroupNavigationComponent,
  TextBoxNavigationComponent,
} from '@app/client/shared/ui-router';
import {
  PageTemplateComponent,
  QuickFiltersTemplateComponent,
} from '@app/client/shared/ui-templates';
import {
  buildButtonGroupNavigation,
  buildInputNavigation,
} from '@app/client/shared/util-router';
import { templateQueries } from '@app/client/templates/data-access';
import { Store, createSelector } from '@ngrx/store';
import { DialogModule, WindowModule } from '@progress/kendo-angular-dialog';
import { FilterMenuModule } from '@progress/kendo-angular-grid';

export const selectNotesListViewModel = createSelector(
  notesQuery.selectNotesTableParams,
  templateQueries.selectAllNoteTemplates,

  (params, templates) => ({
    queryModel: buildInputNavigation({
      params,
      name: 'query',
      placeholder: 'Search Notes',
    }),
    buttonGroupTemplates: buildButtonGroupNavigation({
      params,
      name: 'noteType',
      toggleable: true,
      buttons: templates.map((template) => ({
        id: template.name,
        name: template.name,
      })),
      staticQueryParams: { skip: null },
    }),
    buttonGroupAssignedTo: buildButtonGroupNavigation({
      params,
      name: 'role',
      toggleable: true,
      buttons: [
        {
          id: null,
          name: 'All Notes',
        },
        {
          id: 'created',
          name: 'Created by me',
        },
        {
          id: 'tagged',
          name: 'I am tagged',
        },
      ],
      staticQueryParams: { skip: null },
    }),
  }),
);

@Component({
  selector: 'app-rvnc-notes-feature-notes-list',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    LoaderComponent,
    NotesTableComponent,
    FilterMenuModule,
    QuickFiltersComponent,
    DialogModule,
    WindowModule,
    NoteDetailsComponent,
    NotesTableContainerComponent,
    ButtongroupNavigationComponent,
    PageTemplateComponent,
    TextBoxNavigationComponent,
    QuickFiltersTemplateComponent,
  ],
  providers: [ShelfStoreFacade],
  templateUrl: './rvnc-notes-feature-notes-list.component.html',
  styleUrls: ['./rvnc-notes-feature-notes-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RvncNotesFeatureNotesListComponent {
  protected vm = this.store.selectSignal(selectNotesListViewModel);

  public constructor(private readonly store: Store) {}

  public handleOpenNotepad(): void {
    this.store.dispatch(ShelfActions.openNotepad());
  }
}
