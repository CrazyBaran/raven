import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { NotesTableContainerComponent } from '@app/client/notes/feature/notes-table';
import { ShelfActions } from '@app/client/shared/shelf';
import { TilelayoutItemComponent } from '@app/client/shared/ui';
import { Store } from '@ngrx/store';
import { ButtonModule } from '@progress/kendo-angular-buttons';

@Component({
  selector: 'app-organisation-notes',
  standalone: true,
  imports: [
    TilelayoutItemComponent,
    ButtonModule,
    NotesTableContainerComponent,
  ],
  templateUrl: './organisation-notes.component.html',
  styleUrls: ['./organisation-notes.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrganisationNotesComponent {
  public store = inject(Store);

  public openNoteShelf(): void {
    this.store.dispatch(ShelfActions.openNotepad());
  }
}
