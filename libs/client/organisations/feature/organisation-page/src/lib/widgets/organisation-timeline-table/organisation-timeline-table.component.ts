import {
  CurrencyPipe,
  DatePipe,
  NgClass,
  NgOptimizedImage,
} from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { TagsContainerComponent } from '@app/client/shared/ui';
import { IsEllipsisActiveDirective } from '@app/client/shared/ui-directives';
import { ToUserTagPipe, WhenDatePipe } from '@app/client/shared/ui-pipes';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import { ChartsModule } from '@progress/kendo-angular-charts';
import { GridModule } from '@progress/kendo-angular-grid';
import { PanelBarModule } from '@progress/kendo-angular-layout';
import { TooltipModule } from '@progress/kendo-angular-tooltip';
import 'hammerjs';
import { TIMELINE_DAYS_INTERVAL } from './organisation-timeline-table.const';
import { organisationTimelineTableStore } from './organisation-timeline-table.store';

@Component({
  selector: 'app-organisation-company-timeline',
  standalone: true,
  imports: [
    PanelBarModule,
    GridModule,
    TooltipModule,
    ButtonModule,
    WhenDatePipe,
    NgOptimizedImage,
    NgClass,
    CurrencyPipe,
    DatePipe,
    ChartsModule,
    TagsContainerComponent,
    ToUserTagPipe,
    IsEllipsisActiveDirective,
  ],
  templateUrl: './organisation-timeline-table.component.html',
  styleUrls: ['./organisation-timeline-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [organisationTimelineTableStore],
})
export class OrganisationTimelineTableComponent {
  public TIMELINE_DAYS_INTERVAL = TIMELINE_DAYS_INTERVAL;
  public organisationTimelineStore = inject(organisationTimelineTableStore);

  public loadMore(): void {
    this.organisationTimelineStore.loadMore();
  }

  public rowCallback = (): Record<string, boolean> => {
    return { '!bg-white': true };
  };

  public getTypeIcon(type: string): string {
    switch (type) {
      case 'email':
        return 'fa-envelope icon-email';
      case 'call':
        return 'fa-calendar icon-call';
      default:
        return '';
    }
  }

  public onCollapse(): void {
    this.organisationTimelineStore.reset(
      this.organisationTimelineStore.firstInteraction(),
    );
  }
}
