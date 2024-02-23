import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  signal,
  ViewChild,
} from '@angular/core';
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
import { NavigationStart, Router, RouterLink } from '@angular/router';
import {
  OrganisationsActions,
  OrganisationsUrlActions,
} from '@app/client/organisations/state';
import {
  FilterTilesComponent,
  OrganisationsTableComponent,
} from '@app/client/organisations/ui';
import { PipelinesActions } from '@app/client/pipelines/state';
import { ShowTooltipIfClampedDirective } from '@app/client/shared/ui-directives';
import { isNavigatingAway } from '@app/client/shared/util-router';
import { distinctUntilChangedDeep } from '@app/client/shared/util-rxjs';
import { ShortlistsActions } from '@app/client/shortlists/state';
import { TagsActions } from '@app/client/tags/state';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { TooltipModule } from '@progress/kendo-angular-tooltip';
import { filter, Subject, takeUntil } from 'rxjs';
import {
  selectShortlistOrganisationsTableParams,
  selectShortlistOrganisationsTableViewModel,
} from './shortlist-organisations-table.selectors';

@Component({
  selector: 'app-shortlist-organisations-table',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    ButtongroupNavigationComponent,
    PageTemplateComponent,
    RouterLink,
    TextBoxNavigationComponent,
    FilterTilesComponent,
    OrganisationsTableComponent,
    QuickFiltersTemplateComponent,
    TooltipModule,
    ShowTooltipIfClampedDirective,
  ],
  templateUrl: './shortlist-organisations-table.component.html',
  styleUrl: './shortlist-organisations-table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShortlistOrganisationsTableComponent {
  @ViewChild(OrganisationsTableComponent)
  public organisationTable: OrganisationsTableComponent;

  protected showCreateDialog = signal(false);

  protected vm = this.store.selectSignal(
    selectShortlistOrganisationsTableViewModel,
  );
  protected params = this.store.selectSignal(
    selectShortlistOrganisationsTableParams,
  );

  private navigatedAway$ = new Subject<boolean>();

  public constructor(
    private store: Store,
    private router: Router,
    private actions$: Actions,
  ) {
    this.store.dispatch(PipelinesActions.getPipelinesIfNotLoaded());
    this.store.dispatch(
      TagsActions.getTagsByTypesIfNotLoaded({
        tagTypes: ['opportunity', 'people'],
      }),
    );
    this.store.dispatch(
      OrganisationsActions.getDataWarehouseLastUpdatedIfNotLoaded(),
    );
    this.store.dispatch(
      ShortlistsActions.getShorlistIfNotLoaded({
        id: this.vm().shortlistId!,
      }),
    );

    this.router.events
      .pipe(
        takeUntilDestroyed(),
        filter((event) => event instanceof NavigationStart),
      )
      .subscribe(() => {
        const currentNavigation = router.getCurrentNavigation();
        if (isNavigatingAway(currentNavigation, '/companies')) {
          this.navigatedAway$?.next(true);
          this.navigatedAway$?.complete();
        }
      });

    this.store
      .select(selectShortlistOrganisationsTableParams)
      .pipe(
        takeUntilDestroyed(),
        takeUntil(this.navigatedAway$),
        distinctUntilChangedDeep({ ignoreOrder: true }),
      )
      .subscribe((params) => {
        this.organisationTable?.reset();
        this.store.dispatch(
          OrganisationsUrlActions.queryParamsChanged({
            params: params,
          }),
        );
      });

    this.actions$
      .pipe(
        takeUntilDestroyed(),
        ofType(ShortlistsActions.bulkRemoveOrganisationsFromShortlistSuccess),
      )
      .subscribe(() => {
        this.organisationTable.checkedRows.set([]);
        this.organisationTable.checkedAll.set(false);
        this.store.dispatch(
          OrganisationsUrlActions.queryParamsChanged({
            params: this.params(),
          }),
        );
      });
  }

  protected onLoadMore($event: { offset: number; take: number }): void {
    this.store.dispatch(
      OrganisationsActions.loadMoreOrganisations({
        params: {
          ...this.params(),
          skip: '' + $event.offset,
          take: '' + $event.take,
        },
      }),
    );
  }
}
