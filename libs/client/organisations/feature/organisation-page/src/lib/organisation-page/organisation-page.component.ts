import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';

import { DatePipe, JsonPipe, NgForOf, NgIf, NgStyle } from '@angular/common';
import { NotesTableContainerComponent } from '@app/client/notes/feature/notes-table';
import { NoteDetailsComponent } from '@app/client/notes/ui';
import { StatusIndicatorComponent } from '@app/client/opportunities/ui';
import { OrganisationsActions } from '@app/client/organisations/state';
import { ShelfActions } from '@app/client/shared/shelf';
import {
  LoaderComponent,
  TagComponent,
  UserTagDirective,
  fadeIn,
} from '@app/client/shared/ui';
import {
  DealLeadsPipe,
  DealTeamPipe,
  TimesPipe,
} from '@app/client/shared/ui-pipes';
import { PageTemplateComponent } from '@app/client/shared/ui-templates';
import { Store } from '@ngrx/store';
import { ButtonsModule } from '@progress/kendo-angular-buttons';
import { GridModule } from '@progress/kendo-angular-grid';
import { TileLayoutModule } from '@progress/kendo-angular-layout';
import { SortDescriptor } from '@progress/kendo-data-query';
import { RxFor } from '@rx-angular/template/for';
import { RxIf } from '@rx-angular/template/if';

import { trigger } from '@angular/animations';
import { SkeletonModule } from '@progress/kendo-angular-indicators';
import { selectOrganisationPageViewModel } from './organisation-page.selectors';

@Component({
  selector: 'app-opportunity-details-page',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    ButtonsModule,
    StatusIndicatorComponent,
    RxFor,
    JsonPipe,
    NgIf,
    NoteDetailsComponent,
    NgStyle,
    LoaderComponent,
    PageTemplateComponent,
    GridModule,
    TileLayoutModule,
    NotesTableContainerComponent,
    DatePipe,
    DealLeadsPipe,
    DealTeamPipe,
    TagComponent,
    UserTagDirective,
    RxIf,
    TimesPipe,
    SkeletonModule,
    NgForOf,
  ],
  templateUrl: './organisation-page.component.html',
  styleUrls: ['./organisation-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [trigger('fadeIn', fadeIn())],
})
export class OrganisationPageComponent {
  public sort: SortDescriptor[] = [
    {
      field: 'createdAt',
      dir: 'desc',
    },
  ];
  protected store = inject(Store);
  protected router = inject(Router);

  protected vm = this.store.selectSignal(selectOrganisationPageViewModel);

  public constructor() {
    const organizationId = this.vm().currentOrganisationId;

    if (!organizationId) {
      throw new Error(
        'Organization ID is required for Opportunity Details Page',
      );
    }

    this.store.dispatch(
      OrganisationsActions.getOrganisation({ id: organizationId }),
    );
  }

  public openOpportunityDialog(): void {
    this.store.dispatch(
      ShelfActions.openOpportunityForm({
        payload: {
          organisationId: this.vm().currentOrganisationId,
        },
      }),
    );
  }

  public openNoteShelf(): void {
    this.store.dispatch(ShelfActions.openNotepad());
  }
}
