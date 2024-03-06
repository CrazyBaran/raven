import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  signal,
  ViewChild,
} from '@angular/core';
import {
  ButtongroupNavigationComponent,
  DropdownButtonNavigationComponent,
  TextBoxNavigationComponent,
} from '@app/client/shared/ui-router';
import {
  PageTemplateComponent,
  QuickFiltersTemplateComponent,
} from '@app/client/shared/ui-templates';
import { ButtonModule } from '@progress/kendo-angular-buttons';

import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import {
  OrganisationsActions,
  organisationsQuery,
  OrganisationsUrlActions,
} from '@app/client/organisations/state';
import {
  FilterTilesComponent,
  OrganisationsTableComponent,
} from '@app/client/organisations/ui';
import { PipelinesActions } from '@app/client/pipelines/state';
import { LoaderComponent } from '@app/client/shared/ui';
import { ShowTooltipIfClampedDirective } from '@app/client/shared/ui-directives';
import {
  distinctUntilChangedDeep,
  takeUntilNavigatedAway,
} from '@app/client/shared/util-rxjs';
import { ShortlistsActions } from '@app/client/shortlists/state';
import {
  IsCustomShortlistTypePipe,
  IsMyShortlistTypePipe,
  IsPersonalShortlistTypePipe,
} from '@app/client/shortlists/ui';
import { TagsActions } from '@app/client/tags/state';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { TooltipModule } from '@progress/kendo-angular-tooltip';
import { selectShortlistOrganisationsTableViewModel } from './shortlist-organisations-table.selectors';

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
    DropdownButtonNavigationComponent,
    IsCustomShortlistTypePipe,
    LoaderComponent,
    IsMyShortlistTypePipe,
    IsPersonalShortlistTypePipe,
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
    organisationsQuery.selectOrganisationsTableParams,
  );

  public constructor(
    private store: Store,
    private actions$: Actions,
  ) {
    this.store.dispatch(ShortlistsActions.openShortlistOrganisationsTable());
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

    this.store
      .select(organisationsQuery.selectOrganisationsTableParams)
      .pipe(
        takeUntilDestroyed(),
        takeUntilNavigatedAway({
          route: `/companies/shortlists/${this.vm().shortlistId}`,
        }),
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
      });
  }

  protected onLoadMore($event: { skip: number; take: number }): void {
    this.store.dispatch(
      OrganisationsActions.loadMoreOrganisations({
        params: {
          ...this.params(),
          ...$event,
        },
      }),
    );
  }
}
