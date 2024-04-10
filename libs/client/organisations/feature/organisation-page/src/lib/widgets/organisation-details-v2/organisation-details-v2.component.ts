import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  computed,
  inject,
  input,
  signal,
} from '@angular/core';

import { trigger } from '@angular/animations';
import {
  CurrencyPipe,
  DatePipe,
  NgClass,
  NgOptimizedImage,
} from '@angular/common';
import { RouterLink } from '@angular/router';
import {
  TagsContainerComponent,
  TilelayoutItemComponent,
  fadeIn,
} from '@app/client/shared/ui';
import {
  ClampedChangedDirective,
  OpenInNewTabDirective,
} from '@app/client/shared/ui-directives';
import { TimesPipe } from '@app/client/shared/ui-pipes';
import { DialogUtil } from '@app/client/shared/util';
import { Store } from '@ngrx/store';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import { SkeletonModule } from '@progress/kendo-angular-indicators';
import { TooltipModule } from '@progress/kendo-angular-tooltip';
import { organisationEmployeesChartsStore } from '../organisation-employees-chart/organisation-employees-chart.store';
import { organisationFundingDataTableStore } from '../organisation-funding-data-table/organisation-funding-data-table.store';
import { selectOrganisationDetailsViewModel } from './organisation-details-v2.selectors';

@Component({
  selector: 'app-organisation-details-v2',
  standalone: true,
  imports: [
    TilelayoutItemComponent,
    ButtonModule,
    RouterLink,
    SkeletonModule,
    DatePipe,
    ClampedChangedDirective,
    NgClass,
    TimesPipe,
    TagsContainerComponent,
    OpenInNewTabDirective,
    NgOptimizedImage,
    TooltipModule,
  ],
  templateUrl: './organisation-details-v2.component.html',
  styleUrls: ['./organisation-details-v2.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [CurrencyPipe],
  animations: [trigger('fadeIn', fadeIn())],
})
export class OrganisationDetailsV2Component {
  public type = input.required<'public' | 'details'>();
  public store = inject(Store);
  public cdr = inject(ChangeDetectorRef);
  public currency = inject(CurrencyPipe);

  public vm = this.store.selectSignal(selectOrganisationDetailsViewModel);

  public employeesChartsStore = inject(organisationEmployeesChartsStore);
  public fundingDataStore = inject(organisationFundingDataTableStore);

  public isDescriptionClamped = signal(false);
  public showMoreDescription = signal(false);

  public updateDescriptionParam = computed(() => ({
    [DialogUtil.queryParams.updateOrganisationDescription]:
      this.vm().currentOrganisationId,
  }));

  public descriptionByType = computed(() => {
    if (this.type() === 'public') {
      return this.vm().description;
    }

    return this.vm().customDescription;
  });

  public detailTiles = computed(() => {
    const numberOfEmployees =
      this.employeesChartsStore.data().data[0]?.numberOfEmployees;
    const lastFunding = this.fundingDataStore.data().data[0];

    return [
      {
        label: this.vm().country,
        subLabel: 'HQ Location',
        background: 'var(--series-b-lighten-20)',
      },
      {
        label: numberOfEmployees ? `${numberOfEmployees} people` : undefined,
        subLabel: 'Employees',
        background: 'var(--series-h-lighten-20)',
      },
      {
        label: lastFunding?.round,
        subLabel: 'Last Funding Round',
        background: 'var(--series-g-lighten-20)',
      },
      {
        label: lastFunding?.amountInUsd
          ? `${this.currency.transform(lastFunding.amountInUsd || 0, 'USD')}M`
          : undefined,
        subLabel: 'Last Funding',
        background: 'var(--series-e-lighten-20)',
      },
      {
        label: lastFunding?.postValuationInUsd
          ? `${this.currency.transform(
              lastFunding.postValuationInUsd || 0,
              'USD',
            )}M`
          : undefined,
        subLabel: 'Enterprise Valuation (estimate)',
        background: 'var(--series-c-lighten-20)',
      },
    ];
  });

  public setIsDescriptionClamped(isClamped: boolean): void {
    this.isDescriptionClamped.set(isClamped);

    // This is a workaround to force the change detection to run (should work without it)
    this.cdr.detectChanges();
  }

  public toggleShowMoreBtn(): void {
    this.showMoreDescription.set(!this.showMoreDescription());

    // This is a workaround to force the change detection to run (should work without it)
    this.cdr.detectChanges();
  }
}
