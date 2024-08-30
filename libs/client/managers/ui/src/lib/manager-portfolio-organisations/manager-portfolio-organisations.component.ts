import { CurrencyPipe, DatePipe } from '@angular/common';
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
import { NotificationsActions } from '@app/client/shared/util-notifications';
import { TagsService } from '@app/client/tags/data-access';
import { FundManagerData } from '@app/rvns-fund-managers';
import { OrganisationData } from '@app/rvns-opportunities';
import { TagTypeEnum } from '@app/rvns-tags';
import { Store } from '@ngrx/store';
import { GridModule } from '@progress/kendo-angular-grid';
import { finalize } from 'rxjs';

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
  templateUrl: './manager-portfolio-organisations.component.html',
  styleUrls: ['./manager-portfolio-organisations.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ManagerPortfolioOrganisationsComponent {
  public readonly tagsService = inject(TagsService);
  public readonly router = inject(Router);
  public readonly store = inject(Store);

  public isLoading = input(false);
  public manager = input<FundManagerData>();
  public organisations = input<Array<OrganisationData>>([]);

  public isFetchingInvestorTag = signal(false);

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
