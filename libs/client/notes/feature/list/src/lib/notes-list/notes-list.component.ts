import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NotesTableContainerComponent } from '@app/client/notes/feature/notes-table';
import { ShelfActions } from '@app/client/shared/shelf';
import {
  ButtongroupNavigationComponent,
  TextBoxNavigationComponent,
} from '@app/client/shared/ui-router';
import {
  PageTemplateComponent,
  QuickFiltersTemplateComponent,
} from '@app/client/shared/ui-templates';
import { Store } from '@ngrx/store';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import { selectNotesListViewModel } from './notes-list.selectors';

@Component({
  selector: 'app-notes-list',
  standalone: true,
  imports: [
    PageTemplateComponent,
    TextBoxNavigationComponent,
    ButtonModule,
    QuickFiltersTemplateComponent,
    ButtongroupNavigationComponent,
    NotesTableContainerComponent,
  ],
  templateUrl: './notes-list.component.html',
  styleUrls: ['./notes-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotesListComponent {
  protected vm = this.store.selectSignal(selectNotesListViewModel);

  public constructor(private readonly store: Store) {}

  public handleOpenNotepad(): void {
    this.store.dispatch(ShelfActions.openNotepad({}));
  }
}
