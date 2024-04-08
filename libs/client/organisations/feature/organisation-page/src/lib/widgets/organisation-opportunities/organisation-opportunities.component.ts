import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { DatePipe } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { OpportunitiesActions } from '@app/client/opportunities/data-access';
import { OrganisationsActions } from '@app/client/organisations/state';
import {
  LoaderComponent,
  TagComponent,
  TilelayoutItemComponent,
  UserTagDirective,
} from '@app/client/shared/ui';
import { IsEllipsisActiveDirective } from '@app/client/shared/ui-directives';
import { DealLeadsPipe } from '@app/client/shared/ui-pipes';
import { Actions, ofType } from '@ngrx/effects';
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

  protected actions$ = inject(Actions);

  public constructor() {
    this.actions$
      .pipe(
        takeUntilDestroyed(),
        ofType(OpportunitiesActions.updateOpportunitySuccess),
      )
      .subscribe(() => {
        this.store.dispatch(
          OrganisationsActions.getOrganisation({
            id: this.vm().currentOrganisationId!,
          }),
        );
      });
  }
}
