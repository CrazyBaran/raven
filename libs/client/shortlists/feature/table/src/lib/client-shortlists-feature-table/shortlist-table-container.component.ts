import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  FilterTilesComponent,
  OrganisationsTableComponent,
} from '@app/client/organisations/ui';
import {
  ButtongroupNavigationComponent,
  TextBoxNavigationComponent,
} from '@app/client/shared/ui-router';
import {
  PageTemplateComponent,
  QuickFiltersTemplateComponent,
} from '@app/client/shared/ui-templates';
import { ButtonModule } from '@progress/kendo-angular-buttons';

import { RouterLink } from '@angular/router';
import { DialogQueryParams } from '@app/client/shared/shelf';
import { ShortlistTableComponent } from '@app/client/shortlists/ui';
import { TagsActions } from '@app/client/tags/state';
import { Store } from '@ngrx/store';
import { selectShortlistsTableViewModel } from './shortlist-table-container.selectors';

@Component({
  selector: 'app-shortlist-table-container',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    ButtongroupNavigationComponent,
    FilterTilesComponent,
    OrganisationsTableComponent,
    PageTemplateComponent,
    QuickFiltersTemplateComponent,
    TextBoxNavigationComponent,
    ShortlistTableComponent,
    RouterLink,
  ],
  templateUrl: './shortlist-table-container.component.html',
  styleUrl: './shortlist-table-container.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShortlistTableContainerComponent {
  protected store = inject(Store);

  protected readonly vm = this.store.selectSignal(
    selectShortlistsTableViewModel,
  );

  protected createShortlistQueryParams = {
    [DialogQueryParams.createShortlist]: '',
  };

  addToShortlistQueryParams = {
    [DialogQueryParams.addToShortlist]: '',
  };

  public constructor() {
    this.store.dispatch(
      TagsActions.getTagsByTypesIfNotLoaded({ tagTypes: ['people'] }),
    );
  }

  onLoadMore($event: { offset: number; take: number }) {}
}
