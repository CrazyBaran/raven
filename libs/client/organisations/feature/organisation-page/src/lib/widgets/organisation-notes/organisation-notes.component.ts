import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { DatePipe } from '@angular/common';
import { NotesTableContainerComponent } from '@app/client/notes/feature/notes-table';
import { ShelfActions } from '@app/client/shared/shelf';
import { routerQuery } from '@app/client/shared/util-router';
import { TagsActions, tagsQuery } from '@app/client/tags/state';
import { Store } from '@ngrx/store';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import { BodyModule } from '@progress/kendo-angular-grid';
import { PanelBarModule } from '@progress/kendo-angular-layout';

@Component({
  selector: 'app-organisation-notes',
  standalone: true,
  imports: [
    ButtonModule,
    NotesTableContainerComponent,
    BodyModule,
    DatePipe,
    PanelBarModule,
  ],
  templateUrl: './organisation-notes.component.html',
  styleUrls: ['./organisation-notes.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrganisationNotesComponent {
  public store = inject(Store);
  public organisationId = this.store.selectSignal(
    routerQuery.selectCurrentOrganisationId,
  );
  public organisationTags = this.store.selectSignal(
    tagsQuery.selectTagsByOrganisationId(this.organisationId()!),
  );

  public constructor() {
    this.store.dispatch(
      TagsActions.getTagByOrganisationIdIfNotLoaded({
        organisationId: this.organisationId()!,
      }),
    );
  }

  public openNoteShelf(): void {
    this.store.dispatch(
      ShelfActions.openNotepad({
        organisationId: this.organisationTags()?.find(
          (x) => x?.type === 'company',
        )?.id,
      }),
    );
  }
}
