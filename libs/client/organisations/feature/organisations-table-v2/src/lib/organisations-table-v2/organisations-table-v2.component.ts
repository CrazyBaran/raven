import { DatePipe, KeyValuePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ViewChild,
  signal,
} from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { PipelinesActions } from '@app/client/organisations/api-pipelines';
import { TagsActions } from '@app/client/organisations/api-tags';
import {
  OrganisationsActions,
  OrganisationsUrlActions,
  organisationsQuery,
} from '@app/client/organisations/state';
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
import {
  distinctUntilChangedDeep,
  takeUntilNavigatedAway,
} from '@app/client/shared/util-rxjs';
import {
  ShortlistsActions,
  shortlistsQuery,
} from '@app/client/shortlists/state';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import * as _ from 'lodash';
import { combineLatest, debounceTime, filter, map } from 'rxjs';
import { CreateOrganisationDialogComponent } from '../create-organisation-dialog/create-organisation-dialog.component';
import { selectOrganisationsTableViewModel } from './organisations-table-v2.selectors';
@Component({
  selector: 'app-client-organisations-feature-organisations-table',
  standalone: true,
  imports: [
    PageTemplateComponent,
    TextBoxNavigationComponent,
    ButtonModule,
    QuickFiltersTemplateComponent,
    ButtongroupNavigationComponent,
    FilterTilesComponent,
    OrganisationsTableComponent,
    CreateOrganisationDialogComponent,
    DatePipe,
    KeyValuePipe,
  ],
  templateUrl: './organisations-table-v2.component.html',
  styleUrls: ['./organisations-table-v2.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrganisationsTableV2Component {
  @ViewChild(OrganisationsTableComponent)
  public organisationTable: OrganisationsTableComponent;

  protected showCreateDialog = signal(false);

  protected vm = this.store.selectSignal(selectOrganisationsTableViewModel);
  protected tableParams$ = this.store.select(
    organisationsQuery.selectOrganisationsTableParams,
  );
  protected mainShortlist$ = this.store.select(
    shortlistsQuery.selectMainShortlist,
  );
  protected params$ = combineLatest([
    this.tableParams$,
    this.mainShortlist$,
  ]).pipe(
    debounceTime(25),
    filter(
      ([params, mainShortlist]) =>
        params.member !== 'shortlisted' || !!mainShortlist,
    ),
    map(([params, mainShortlist]) => {
      if (params.member === 'shortlisted') {
        return {
          ..._.omit(params, 'member'),
          shortlistId: mainShortlist!.id,
        };
      }
      return params;
    }),
    distinctUntilChangedDeep(),
  );

  protected params = toSignal(this.params$);

  public constructor(
    private store: Store,
    private actions$: Actions,
  ) {
    this.store.dispatch(OrganisationsActions.openOrganisationsTable());
    this.store.dispatch(PipelinesActions.getPipelines());
    this.store.dispatch(
      TagsActions.getTagsByTypesIfNotLoaded({
        tagTypes: ['opportunity', 'people'],
      }),
    );
    this.store.dispatch(OrganisationsActions.getDataWarehouseLastUpdated());
    this.store.dispatch(ShortlistsActions.getShortlistExtras());

    this.params$
      .pipe(
        takeUntilDestroyed(),
        takeUntilNavigatedAway({ route: '/companies' }),
        distinctUntilChangedDeep({ ignoreOrder: true }),
      )
      .subscribe((params) => {
        this.organisationTable?.reset();
        this.store.dispatch(
          OrganisationsUrlActions.queryParamsChanged({ params }),
        );
      });

    this.actions$
      .pipe(
        takeUntilDestroyed(),
        ofType(ShortlistsActions.bulkAddOrganisationsToShortlistSuccess),
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
