import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NotesTableContainerComponent } from '@app/client/notes/feature/notes-table';
import {
  NoteDetailsComponent,
  NotesTableComponent,
  QuickFiltersComponent,
} from '@app/client/notes/ui';
import { ShelfStoreFacade } from '@app/client/shared/shelf';
import { HeaderComponent, LoaderComponent } from '@app/client/shared/ui';
import { DialogModule, WindowModule } from '@progress/kendo-angular-dialog';
import { FilterMenuModule } from '@progress/kendo-angular-grid';

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
  ],
  providers: [ShelfStoreFacade],
  templateUrl: './rvnc-notes-feature-notes-list.component.html',
  styleUrls: ['./rvnc-notes-feature-notes-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RvncNotesFeatureNotesListComponent {
  public constructor(private readonly shelfFacade: ShelfStoreFacade) {}

  public handleOpenNotepad(): void {
    this.shelfFacade.openNotepad();
  }
}
