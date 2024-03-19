import { NgClass, NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { TilelayoutItemComponent } from '@app/client/shared/ui';
import { WhenDatePipe } from '@app/client/shared/ui-pipes';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import { GridModule } from '@progress/kendo-angular-grid';
import { TooltipModule } from '@progress/kendo-angular-tooltip';
import { organisationNewsTableStore } from './organisation-news-table.store';

@Component({
  selector: 'app-organisation-news-table',
  standalone: true,
  imports: [
    TilelayoutItemComponent,
    GridModule,
    TooltipModule,
    ButtonModule,
    WhenDatePipe,
    NgOptimizedImage,
    NgClass,
  ],
  templateUrl: './organisation-news-table.component.html',
  styleUrls: ['./organisation-news-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [organisationNewsTableStore],
})
export class OrganisationNewsTableComponent {
  public organisationNewsStore = inject(organisationNewsTableStore);

  public loadMore(): void {
    this.organisationNewsStore.loadMore();
  }

  public rowCallback = (): Record<string, boolean> => {
    return { '!bg-white': true };
  };
}
