import { CurrencyPipe, DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { TilelayoutItemComponent } from '@app/client/shared/ui';
import { FundManagerData } from '@app/rvns-fund-managers';
import { OrganisationData } from '@app/rvns-opportunities';
import { GridModule } from '@progress/kendo-angular-grid';

@Component({
  selector: 'app-manager-portfolio-organisations',
  standalone: true,
  imports: [
    RouterLink,
    TilelayoutItemComponent,
    GridModule,
    CurrencyPipe,
    DatePipe,
  ],
  templateUrl: './manager-portfolio-organisations.component.html',
  styleUrls: ['./manager-portfolio-organisations.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ManagerPortfolioOrganisationsComponent {
  public isLoading = input(false);
  public manager = input<FundManagerData>();
  public organisations = input<Array<OrganisationData>>([]);

  // TODO: type for fundManagers list in organisation data
  public filteredOrganisations = computed(() =>
    this.organisations().map((organisation) => ({
      ...organisation,
      fundManagers:
        (organisation as any).fundManagers?.filter(
          (item: any) => item.id !== this.manager()?.id,
        ) || [],
    })),
  );
}
