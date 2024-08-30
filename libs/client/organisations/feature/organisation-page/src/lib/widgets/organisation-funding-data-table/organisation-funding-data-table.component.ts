import {
  CurrencyPipe,
  DatePipe,
  NgClass,
  NgOptimizedImage,
} from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  signal,
} from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import {
  LoaderComponent,
  TilelayoutItemComponent,
} from '@app/client/shared/ui';
import { WhenDatePipe } from '@app/client/shared/ui-pipes';
import { NotificationsActions } from '@app/client/shared/util-notifications';
import { TagsService } from '@app/client/tags/data-access';
import { TagTypeEnum } from '@app/rvns-tags';
import { Store } from '@ngrx/store';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import { ChartsModule } from '@progress/kendo-angular-charts';
import { GridModule } from '@progress/kendo-angular-grid';
import { TooltipModule } from '@progress/kendo-angular-tooltip';
import 'hammerjs';
import { finalize } from 'rxjs';
import { organisationFundingDataTableStore } from './organisation-funding-data-table.store';

@Component({
  selector: 'app-organisation-funding-data-table',
  standalone: true,
  imports: [
    RouterLink,
    TilelayoutItemComponent,
    GridModule,
    TooltipModule,
    ButtonModule,
    WhenDatePipe,
    NgOptimizedImage,
    NgClass,
    CurrencyPipe,
    DatePipe,
    ChartsModule,
    LoaderComponent,
  ],
  templateUrl: './organisation-funding-data-table.component.html',
  styleUrls: ['./organisation-funding-data-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrganisationFundingDataTableComponent {
  public readonly tagsService = inject(TagsService);
  public readonly router = inject(Router);
  public readonly store = inject(Store);

  public withChart = input(true);

  public organisationFundingDataStore = inject(
    organisationFundingDataTableStore,
  );

  public isFetchingInvestorTag = signal(false);

  public loadMore(): void {
    this.organisationFundingDataStore.loadMore();
  }

  public rowCallback = (): Record<string, boolean> => {
    return { '!bg-white': true };
  };

  public getInvestorTag(name: string): void {
    this.isFetchingInvestorTag.set(true);

    this.tagsService
      .getTags({ type: TagTypeEnum.Investor, query: name, take: 1 })
      .pipe(finalize(() => this.isFetchingInvestorTag.set(false)))
      .subscribe((data) => {
        if (data.data?.length && data.data[0].fundManagerId) {
          this.router.navigate(['/managers', data.data[0].fundManagerId]);
        } else {
          this.store.dispatch(
            NotificationsActions.showErrorNotification({
              content: 'Could not find manager for this investor',
            }),
          );
        }
      });
  }
}
