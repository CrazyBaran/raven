import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { OpportunitiesActions } from '@app/client/opportunities/data-access';
import { OrganisationsUrlActions } from '@app/client/organisations/state';
import { OrganisationsTableViewComponent } from '@app/client/organisations/ui';
import { PipelinesActions } from '@app/client/pipelines/state';
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
import { ButtonModule } from '@progress/kendo-angular-buttons';
import { LoaderModule } from '@progress/kendo-angular-indicators';
import { RxFor } from '@rx-angular/template/for';
import { RxIf } from '@rx-angular/template/if';
import { map } from 'rxjs';
import { selectOrganisationsTableViewModel } from './organisations-table.selectors';

@Component({
  selector: 'app-client-organisations-feature-organisations-table',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    ButtongroupNavigationComponent,
    PageTemplateComponent,
    TextBoxNavigationComponent,
    QuickFiltersTemplateComponent,
    DropdownNavigationComponent,
    RxFor,
    LoaderModule,
    RxIf,
    OrganisationsTableViewComponent,
  ],
  templateUrl: './organisations-table.component.html',
  styleUrls: ['./organisations-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrganisationsTableComponent {
  protected store = inject(Store);

  protected vm$ = this.store.select(selectOrganisationsTableViewModel)!;
  protected vm = this.store.selectSignal(selectOrganisationsTableViewModel);

  public constructor() {
    this.store.dispatch(
      OpportunitiesActions.getOpportunities({ take: 500, skip: 0 }),
    );

    this.store.dispatch(PipelinesActions.getPipelines());

    this.vm$
      .pipe(
        takeUntilDestroyed(),
        map(({ query }) => query),
        distinctUntilChangedDeep({ ignoreOrder: true }),
      )
      .subscribe((params) => {
        this.store.dispatch(
          OrganisationsUrlActions.queryParamsChanged({ params }),
        );
      });
  }

  public openOrganisationDialog(): void {}
}
