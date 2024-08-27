import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  ButtongroupNavigationComponent,
  DropdownNavigationComponent,
  TextBoxNavigationComponent,
} from '@app/client/shared/ui-router';
import {
  PageTemplateComponent,
  QuickFiltersTemplateComponent,
} from '@app/client/shared/ui-templates';
import { ButtonModule } from '@progress/kendo-angular-buttons';

import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { ManagersActions, managersQuery } from '@app/client/managers/state';
import { ManagersTableComponent } from '@app/client/managers/ui';
import { distinctUntilChangedDeep } from '@app/client/shared/util-rxjs';
import { TagsActions } from '@app/client/tags/state';
import { Actions } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { selectManagersTableViewModel } from './managers-table-container.selectors';

@Component({
  selector: 'app-managers-table-container',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    ButtongroupNavigationComponent,
    PageTemplateComponent,
    QuickFiltersTemplateComponent,
    TextBoxNavigationComponent,
    RouterLink,
    DropdownNavigationComponent,
    ManagersTableComponent,
  ],
  templateUrl: './managers-table-container.component.html',
  styleUrl: './managers-table-container.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ManagersTableContainerComponent {
  protected readonly actions$ = inject(Actions);
  protected readonly store = inject(Store);

  protected readonly vm = this.store.selectSignal(selectManagersTableViewModel);
  protected readonly params = this.store.selectSignal(
    managersQuery.selectManagersTableParams,
  );

  public constructor() {
    this.store.dispatch(ManagersActions.openManagersTable());

    this.store.dispatch(
      TagsActions.getTagsByTypesIfNotLoaded({
        tagTypes: ['people'],
      }),
    );

    this.store
      .select(managersQuery.selectManagersTableParams)
      .pipe(takeUntilDestroyed(), distinctUntilChangedDeep())
      .subscribe((query) =>
        this.store.dispatch(ManagersActions.getManagers({ query })),
      );
  }

  protected onLoadMore($event: { skip: number; take: number }): void {
    this.store.dispatch(
      ManagersActions.loadMoreManagers({
        query: { ...this.params(), ...$event },
      }),
    );
  }
}
