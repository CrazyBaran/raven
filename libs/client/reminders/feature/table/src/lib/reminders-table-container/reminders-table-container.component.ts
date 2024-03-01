import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  ViewChild,
} from '@angular/core';
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
import { RemindersActions, remindersQuery } from '@app/client/reminders/state';
import { RemindersTableComponent } from '@app/client/reminders/ui';
import { DialogUtil } from '@app/client/shared/util';
import { distinctUntilChangedDeep } from '@app/client/shared/util-rxjs';
import { ShortlistTableComponent } from '@app/client/shortlists/ui';
import { TagsActions } from '@app/client/tags/state';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { selectRemindersTableViewModel } from './reminders-table-container.selectors';

@Component({
  selector: 'app-reminders-table-container',
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
    RemindersTableComponent,
  ],
  templateUrl: './reminders-table-container.component.html',
  styleUrl: './reminders-table-container.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RemindersTableContainerComponent {
  @ViewChild(RemindersTableComponent)
  public remindersTable: RemindersTableComponent;

  protected actions$ = inject(Actions);
  protected store = inject(Store);

  protected readonly vm = this.store.selectSignal(
    selectRemindersTableViewModel,
  );

  protected readonly params = this.store.selectSignal(
    remindersQuery.selectRemindersTableParams,
  );

  protected createShortlistQueryParams = {
    [DialogUtil.queryParams.createReminder]: '',
  };

  public constructor() {
    this.store.dispatch(RemindersActions.openReminderTable());
    this.store.dispatch(
      TagsActions.getTagsByTypesIfNotLoaded({ tagTypes: ['people'] }),
    );
    this.store
      .select(remindersQuery.selectRemindersTableParams)
      .pipe(takeUntilDestroyed(), distinctUntilChangedDeep())
      .subscribe((query) => {
        this.store.dispatch(RemindersActions.getReminders({ query }));
      });

    this.actions$
      .pipe(
        takeUntilDestroyed(),
        ofType(RemindersActions.createReminderSuccess),
      )
      .subscribe(() => {
        this.store.dispatch(RemindersActions.reloadRemindersTable());
        this.remindersTable.checkedRows$.next([]);
      });

    this.actions$
      .pipe(
        takeUntilDestroyed(),
        ofType(RemindersActions.completeReminderSuccess),
      )
      .subscribe(() => {
        this.remindersTable.checkedRows$.next([]);
        this.store.dispatch(RemindersActions.reloadRemindersTable());
      });
  }

  protected onLoadMore($event: { skip: number; take: number }): void {
    this.store.dispatch(
      RemindersActions.loadMoreReminders({
        query: { ...this.params(), ...$event },
      }),
    );
  }
}
