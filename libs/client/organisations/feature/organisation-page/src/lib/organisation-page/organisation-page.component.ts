import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
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
import { CreateOpportunityOnStageDialogComponent } from '@app/client/opportunities/feature/dialogs';
import {
  OrganisationStatusComponent,
  ShortlistButtonComponent,
} from '@app/client/organisations/ui';
import { PipelinesActions } from '@app/client/pipelines/state';
import {
  FeatureFlagDirective,
  IsEllipsisActiveDirective,
} from '@app/client/shared/ui-directives';
import { PageTemplateComponent } from '@app/client/shared/ui-templates';
import { TagsActions } from '@app/client/tags/state';
import { Actions } from '@ngrx/effects';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import { SkeletonModule } from '@progress/kendo-angular-indicators';
import { TabStripModule } from '@progress/kendo-angular-layout';
import { TooltipModule } from '@progress/kendo-angular-tooltip';
import { filter } from 'rxjs';
import { ORGANISATION_WIDGETS } from '../widgets';
import { organisationContactsStore } from '../widgets/organisation-contacts/organisation-contacts.store';
import { OrganisationDetailsV2Component } from '../widgets/organisation-details-v2/organisation-details-v2.component';
import { organisationEmployeesChartsStore } from '../widgets/organisation-employees-chart/organisation-employees-chart.store';
import { organisationFundingDataTableStore } from '../widgets/organisation-funding-data-table/organisation-funding-data-table.store';
import { organisationNewsTableStore } from '../widgets/organisation-news-table/organisation-news-table.store';
import { organisationShortlistsTableStore } from '../widgets/organisation-shortlists-table/organisation-shortlists-table.store';
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
    TitleCasePipe,
    IsEllipsisActiveDirective,
    TabStripModule,
    NgTemplateOutlet,
    OrganisationDetailsV2Component,
    DatePipe,
    ShortlistButtonComponent,
    OrganisationStatusComponent,
    SkeletonModule,
    CreateOpportunityOnStageDialogComponent,
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
    organisationShortlistsTableStore,
  ],
  animations: [trigger('fadeIn', fadeIn())],
})
export class OrganisationPageComponent {
  public store = inject(Store);

  public vm = this.store.selectSignal(selectOrganisationPageViewModel);

  public organisationShortlistsStore = inject(organisationShortlistsTableStore);

  public showCreateOpportunityOnStageDialog = signal(false);

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

  public openCreateOpportunityOnStageDialog(): void {
    this.showCreateOpportunityOnStageDialog.set(true);
  }

  public closeCreateOpportunityOnStageDialog(): void {
    this.showCreateOpportunityOnStageDialog.set(false);
  }

  public submitCreateOpportunityOnStageDialog(): void {
    this.store.dispatch(
      OrganisationsActions.getOrganisation({
        id: this.vm().currentOrganisation!.id!,
      }),
    );

    this.closeCreateOpportunityOnStageDialog();
  }
}
