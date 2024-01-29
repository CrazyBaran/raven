import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { PipelinesActions } from '@app/client/organisations/api-pipelines';
import { TagsActions } from '@app/client/organisations/api-tags';
import {
  OrganisationsActions,
  OrganisationsUrlActions,
} from '@app/client/organisations/state';
import { OrganisationsTableViewComponent } from '@app/client/organisations/ui';
import { ShelfActions } from '@app/client/shared/shelf';
import {
  ButtongroupNavigationComponent,
  DropdownNavigationComponent,
  TextBoxNavigationComponent,
} from '@app/client/shared/ui-router';
import {
  PageTemplateComponent,
  QuickFiltersTemplateComponent,
} from '@app/client/shared/ui-templates';
import { distinctUntilChangedDeep } from '@app/client/shared/util-rxjs';
import { Store } from '@ngrx/store';
import {
  selectOrganisationsTableParams,
  selectOrganisationsTableViewModel,
} from './organisations-table.selectors';

@Component({
  selector: 'app-client-organisations-feature-organisations-table',
  standalone: true,
  imports: [
    PageTemplateComponent,
    TextBoxNavigationComponent,
    QuickFiltersTemplateComponent,
    ButtongroupNavigationComponent,
    DropdownNavigationComponent,
    OrganisationsTableViewComponent,
    OrganisationsTableViewComponent,
    DatePipe,
  ],
  templateUrl: './organisations-table.component.html',
  styleUrls: ['./organisations-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrganisationsTableComponent {
  protected store = inject(Store);

  protected vm = this.store.selectSignal(selectOrganisationsTableViewModel);

  public constructor() {
    this.store.dispatch(PipelinesActions.getPipelines());
    this.store.dispatch(
      TagsActions.getTagsByTypesIfNotLoaded({
        tagTypes: ['opportunity', 'people'],
      }),
    );
    this.store.dispatch(OrganisationsActions.getDataWarehouseLastUpdated());

    this.store
      .select(selectOrganisationsTableParams)
      .pipe(
        takeUntilDestroyed(),
        distinctUntilChangedDeep({ ignoreOrder: true }),
      )
      .subscribe((params) => {
        this.store.dispatch(
          OrganisationsUrlActions.queryParamsChanged({ params }),
        );
      });
  }

  public openOrganisationDialog(): void {
    this.store.dispatch(ShelfActions.openOpportunityForm({}));
  }
}
