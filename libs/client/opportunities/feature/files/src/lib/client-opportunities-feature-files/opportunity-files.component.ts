import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import {
  ButtongroupNavigationComponent,
  DropdownNavigationComponent,
} from '@app/client/shared/ui-router';
import { QuickFiltersTemplateComponent } from '@app/client/shared/ui-templates';
import {
  buildDropdownNavigation,
  buildPageParamsSelector,
} from '@app/client/shared/util-router';
import { Store, createSelector } from '@ngrx/store';
import {
  ButtonGroupModule,
  ButtonModule,
} from '@progress/kendo-angular-buttons';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { RxFor } from '@rx-angular/template/for';

const opportunityFilesQueryParams = [
  'fileType',
  'organisationId',
  'opportunityId',
] as const;

export const selectOrganisationsTableParams = buildPageParamsSelector(
  opportunityFilesQueryParams,
);

const FILE_FILTERS = [
  {
    name: 'Company Material',
    id: 'company',
  },
  {
    name: 'Notes & Analysis',
    id: 'note_and_analysis',
  },
  {
    name: 'Market Research',
    id: 'market_research',
  },
];

export const selectOpportunityFilesViewModel = createSelector(
  selectOrganisationsTableParams,
  (params) => ({
    filters: buildDropdownNavigation({
      params,
      name: 'fileType',
      data: FILE_FILTERS,
      loading: false,
      defaultItem: {
        name: 'All Files',
        id: null,
      },
    }),
    // filters: FILE_FILTERS.map((f) => ({
    //   ...f,
    //   selected: f.id === (fileFilter ?? FILE_FILTERS[0].id),
    // })),
  }),
);

@Component({
  selector: 'app-client-opportunities-feature-files',
  standalone: true,
  imports: [
    CommonModule,
    ButtonGroupModule,
    DropDownsModule,
    RouterLink,
    RxFor,
    ButtonModule,
    RouterOutlet,
    DropdownNavigationComponent,
    ButtongroupNavigationComponent,
    QuickFiltersTemplateComponent,
  ],
  templateUrl: './opportunity-files.component.html',
  styleUrls: ['./opportunity-files.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OpportunityFilesComponent {
  protected store = inject(Store);

  protected vm = this.store.selectSignal(selectOpportunityFilesViewModel);
}
