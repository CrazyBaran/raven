import {
  ChangeDetectionStrategy,
  Component,
  inject,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { Router, RouterLink } from '@angular/router';

import {
  OrganisationsActions,
  organisationsFeature,
} from '@app/client/organisations/state';
import { fadeIn } from '@app/client/shared/ui';
import { Store } from '@ngrx/store';

import { trigger } from '@angular/animations';
import {
  DatePipe,
  NgClass,
  NgTemplateOutlet,
  TitleCasePipe,
} from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FilesActions } from '@app/client/files/feature/state';
import { PipelinesActions } from '@app/client/pipelines/state';
import {
  FeatureFlagDirective,
  IsEllipsisActiveDirective,
} from '@app/client/shared/ui-directives';
import {
  DropdownAction,
  DropdownButtonNavigationComponent,
} from '@app/client/shared/ui-router';
import { PageTemplateComponent } from '@app/client/shared/ui-templates';
import { DialogUtil } from '@app/client/shared/util';
import { TagsActions } from '@app/client/tags/state';
import { Actions } from '@ngrx/effects';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import { TabStripModule } from '@progress/kendo-angular-layout';
import { TooltipModule } from '@progress/kendo-angular-tooltip';
import { filter } from 'rxjs';
import { ORGANISATION_WIDGETS } from '../widgets';
import { organisationContactsStore } from '../widgets/organisation-contacts/organisation-contacts.store';
import { OrganisationDetailsV2Component } from '../widgets/organisation-details-v2/organisation-details-v2.component';
import { organisationEmployeesChartsStore } from '../widgets/organisation-employees-chart/organisation-employees-chart.store';
import { organisationFundingDataTableStore } from '../widgets/organisation-funding-data-table/organisation-funding-data-table.store';
import { organisationNewsTableStore } from '../widgets/organisation-news-table/organisation-news-table.store';
import { OrganisationShortlistsTableComponent } from '../widgets/organisation-shortlists-table/organisation-shortlists-table.component';
import { selectOrganisationPageViewModel } from './organisation-page.selectors';

@Component({
  selector: 'app-opportunity-details-page',
  standalone: true,
  imports: [
    ORGANISATION_WIDGETS,
    PageTemplateComponent,
    FeatureFlagDirective,
    NgClass,
    TooltipModule,
    RouterLink,
    ButtonModule,
    DropdownButtonNavigationComponent,
    TitleCasePipe,
    IsEllipsisActiveDirective,
    TabStripModule,
    NgTemplateOutlet,
    OrganisationDetailsV2Component,
    DatePipe,
  ],
  templateUrl: './organisation-page.component.html',
  styleUrls: ['./organisation-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  providers: [
    organisationEmployeesChartsStore,
    organisationFundingDataTableStore,
    organisationNewsTableStore,
    organisationContactsStore,
  ],
  animations: [trigger('fadeIn', fadeIn())],
})
export class OrganisationPageComponent {
  @ViewChild(OrganisationShortlistsTableComponent)
  public shortlistsTable: OrganisationShortlistsTableComponent;

  public store = inject(Store);

  public vm = this.store.selectSignal(selectOrganisationPageViewModel);

  public dropdownButtonActions = {
    actions: [
      {
        text: 'Pass on Company',
        routerLink: ['./'],
        queryParams: {
          [DialogUtil.queryParams.passCompany]: this.vm().currentOrganisationId,
        },
        skipLocationChange: true,
        queryParamsHandling: 'merge',
      } as DropdownAction,
    ],
  };

  protected actions$ = inject(Actions);

  protected router = inject(Router);

  public constructor() {
    const organizationId = this.vm().currentOrganisationId;

    this.store.dispatch(
      OrganisationsActions.getOrganisation({ id: organizationId }),
    );

    this.store.dispatch(
      TagsActions.getTagsByTypesIfNotLoaded({ tagTypes: ['people'] }),
    );

    this.store.dispatch(PipelinesActions.getPipelines());

    this.store
      .select(organisationsFeature.selectCurrentOrganisation)
      .pipe(
        takeUntilDestroyed(),
        filter((o) => !!o),
      )
      .subscribe((organisation) => {
        this.store.dispatch(
          FilesActions.getFiles({
            directoryUrl: organisation!.sharepointDirectory!,
            folderId: organisation!.sharepointDirectory!,
          }),
        );
      });
  }
}
