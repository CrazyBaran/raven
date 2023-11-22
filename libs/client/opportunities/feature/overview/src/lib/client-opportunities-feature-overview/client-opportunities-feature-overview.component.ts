import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { trigger } from '@angular/animations';
import { RouterLink } from '@angular/router';
import {
  fadeIn,
  KendoDynamicPagingDirective,
  LoaderComponent,
  TagComponent,
  UserTagDirective,
} from '@app/client/shared/ui';
import { TimesPipe } from '@app/client/shared/ui-pipes';
import { Store } from '@ngrx/store';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import { GridModule } from '@progress/kendo-angular-grid';
import { SkeletonModule } from '@progress/kendo-angular-indicators';
import { TileLayoutModule } from '@progress/kendo-angular-layout';
import { RxFor } from '@rx-angular/template/for';
import { selectOpportunityOverviewViewModel } from './client-opportunities-feature-overview.selectors';

@Component({
  selector: 'app-client-opportunities-feature-overview',
  standalone: true,
  imports: [
    CommonModule,
    TileLayoutModule,
    ButtonModule,
    RxFor,
    GridModule,
    TagComponent,
    UserTagDirective,
    RouterLink,
    KendoDynamicPagingDirective,
    LoaderComponent,
    SkeletonModule,
    TimesPipe,
  ],
  templateUrl: './client-opportunities-feature-overview.component.html',
  styleUrls: ['./client-opportunities-feature-overview.component.scss'],
  animations: [trigger('fadeIn', fadeIn())],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClientOpportunitiesFeatureOverviewComponent {
  protected store = inject(Store);

  protected vm = this.store.selectSignal(selectOpportunityOverviewViewModel);
}
