import { DatePipe, KeyValuePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ViewChild,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationStart, Router } from '@angular/router';
import { PipelinesActions } from '@app/client/organisations/api-pipelines';
import { TagsActions } from '@app/client/organisations/api-tags';
import {
  OrganisationsActions,
  OrganisationsUrlActions,
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
import { distinctUntilChangedDeep } from '@app/client/shared/util-rxjs';
import { Store } from '@ngrx/store';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import { Subject, filter, takeUntil } from 'rxjs';
import { CreateOrganisationDialogComponent } from '../create-organisation-dialog/create-organisation-dialog.component';
import {
  selectOrganisationsTableParams,
  selectOrganisationsTableViewModel,
} from './organisations-table-v2.selectors';

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
  protected params = this.store.selectSignal(selectOrganisationsTableParams);

  private navigatedAway$ = new Subject<boolean>();

  public constructor(
    private store: Store,
    private router: Router,
  ) {
    this.store.dispatch(PipelinesActions.getPipelines());
    this.store.dispatch(
      TagsActions.getTagsByTypesIfNotLoaded({
        tagTypes: ['opportunity', 'people'],
      }),
    );
    this.store.dispatch(OrganisationsActions.getDataWarehouseLastUpdated());

    this.router.events
      .pipe(
        takeUntilDestroyed(),
        filter((event) => event instanceof NavigationStart),
      )
      .subscribe(() => {
        const currentNavigation = router.getCurrentNavigation();
        if (currentNavigation && !currentNavigation.extras?.relativeTo) {
          this.navigatedAway$?.next(true);
          this.navigatedAway$?.complete();
        }
      });

    this.store
      .select(selectOrganisationsTableParams)
      .pipe(
        takeUntilDestroyed(),
        takeUntil(this.navigatedAway$),
        distinctUntilChangedDeep({ ignoreOrder: true }),
      )
      .subscribe((params) => {
        this.organisationTable?.reset();
        this.store.dispatch(
          OrganisationsUrlActions.queryParamsChanged({ params }),
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
