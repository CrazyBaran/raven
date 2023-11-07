import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { opportunitiesQuery } from '@app/client/opportunities/data-access';
import { getRouterSelectors } from '@ngrx/router-store';
import { Store, createSelector } from '@ngrx/store';
import {
  ButtonGroupModule,
  ButtonModule,
} from '@progress/kendo-angular-buttons';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { RxFor } from '@rx-angular/template/for';

const FILE_FILTERS = [
  {
    name: 'All Files',
    id: null,
  },
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
  opportunitiesQuery.selectRouteOpportunityDetails,
  getRouterSelectors().selectQueryParam('fileFilter'),
  (opportunity, fileFilter) => ({
    filters: FILE_FILTERS.map((f) => ({
      ...f,
      selected: f.id === (fileFilter ?? FILE_FILTERS[0].id),
    })),
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
  ],
  templateUrl: './opportunity-files.component.html',
  styleUrls: ['./opportunity-files.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OpportunityFilesComponent {
  protected store = inject(Store);

  protected vm = this.store.selectSignal(selectOpportunityFilesViewModel);
}
