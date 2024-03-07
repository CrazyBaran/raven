import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import {
  LoaderComponent,
  TagComponent,
  TilelayoutItemComponent,
  UserTagDirective,
} from '@app/client/shared/ui';
import { IsEllipsisActiveDirective } from '@app/client/shared/ui-directives';
import { DealLeadsPipe } from '@app/client/shared/ui-pipes';
import { Store } from '@ngrx/store';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import { GridModule } from '@progress/kendo-angular-grid';
import { SortDescriptor } from '@progress/kendo-data-query';
import { selectOrganisationOpportunitiesViewModel } from './organisation-opportunities.selectors';

@Component({
  selector: 'app-organisation-opportunities',
  standalone: true,
  imports: [
    TilelayoutItemComponent,
    ButtonModule,
    GridModule,
    RouterLink,
    LoaderComponent,
    DatePipe,
    IsEllipsisActiveDirective,
    DealLeadsPipe,
    UserTagDirective,
    TagComponent,
  ],
  templateUrl: './organisation-opportunities.component.html',
  styleUrls: ['./organisation-opportunities.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrganisationOpportunitiesComponent {
  public store = inject(Store);
  public vm = this.store.selectSignal(selectOrganisationOpportunitiesViewModel);

  public sort: SortDescriptor[] = [
    {
      field: 'createdAt',
      dir: 'desc',
    },
  ];
}
