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

import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { DialogUtil } from '@app/client/shared/util';
import { distinctUntilChangedDeep } from '@app/client/shared/util-rxjs';
import { ShortlistsActions } from '@app/client/shortlists/state';
import { ShortlistTableComponent } from '@app/client/shortlists/ui';
import { TagsActions } from '@app/client/tags/state';
import { Actions } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import {
  selectShortlistsTableParams,
  selectShortlistsTableViewModel,
} from './shortlist-table-container.selectors';

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
  protected actions$ = inject(Actions);
  protected store = inject(Store);

  protected readonly vm = this.store.selectSignal(
    selectShortlistsTableViewModel,
  );

  protected readonly params = this.store.selectSignal(
    selectShortlistsTableParams,
  );

  protected createShortlistQueryParams = {
    [DialogUtil.queryParams.createShortlist]: '',
  };

  public constructor() {
    this.store.dispatch(ShortlistsActions.openShortlistTable());
    this.store.dispatch(
      TagsActions.getTagsByTypesIfNotLoaded({ tagTypes: ['people'] }),
    );

    this.store
      .select(selectShortlistsTableParams)
      .pipe(takeUntilDestroyed(), distinctUntilChangedDeep())
      .subscribe((query) => {
        this.store.dispatch(ShortlistsActions.getShortlists({ query }));
      });
  }

  protected onLoadMore($event: { skip: number; take: number }): void {
    this.store.dispatch(
      ShortlistsActions.loadMoreShortlists({
        query: { ...this.params(), ...$event },
      }),
    );
  }
}
