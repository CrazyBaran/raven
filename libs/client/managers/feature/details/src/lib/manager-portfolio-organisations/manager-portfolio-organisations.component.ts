import { CurrencyPipe, DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  LoaderComponent,
  TilelayoutItemComponent,
} from '@app/client/shared/ui';
import { NotificationsActions } from '@app/client/shared/util-notifications';
import { TagsService } from '@app/client/tags/data-access';
import { FundManagerData } from '@app/rvns-fund-managers';
import { TagTypeEnum } from '@app/rvns-tags';
import { Store } from '@ngrx/store';
import { GridModule } from '@progress/kendo-angular-grid';
import { finalize } from 'rxjs';
import { InfinityTableViewBaseComponent } from '../../../../../../shared/ui-directives/src';
import { managerPortfolioStore } from './manager-portfolio-organisations.store';

@Component({
  selector: 'app-manager-portfolio-organisations',
  standalone: true,
  imports: [
    RouterLink,
    TilelayoutItemComponent,
    GridModule,
    CurrencyPipe,
    DatePipe,
    LoaderComponent,
  ],
  providers: [managerPortfolioStore],
  templateUrl: './manager-portfolio-organisations.component.html',
  styleUrls: ['./manager-portfolio-organisations.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ManagerPortfolioOrganisationsComponent extends InfinityTableViewBaseComponent<FundManagerData> {
  public readonly tagsService = inject(TagsService);
  public readonly store = inject(Store);

  public isFetchingInvestorTag = signal(false);

  public readonly managerPortfolioStore = inject(managerPortfolioStore);

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

  public rowCallback = (): Record<string, boolean> => {
    return { '!bg-white': true };
  };
}
