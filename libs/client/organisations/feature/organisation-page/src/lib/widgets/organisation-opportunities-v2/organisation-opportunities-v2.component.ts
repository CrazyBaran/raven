import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';

import { DatePipe, NgClass } from '@angular/common';
import { RouterLink } from '@angular/router';
import {
  OpportunitiesActions,
  OpportunitiesService,
} from '@app/client/opportunities/data-access';
import { organisationsQuery } from '@app/client/organisations/state';
import { pipelinesQuery } from '@app/client/pipelines/state';
import {
  LoaderComponent,
  TagComponent,
  TilelayoutItemComponent,
  UserTagDirective,
} from '@app/client/shared/ui';
import { IsEllipsisActiveDirective } from '@app/client/shared/ui-directives';
import { DealLeadsPipe } from '@app/client/shared/ui-pipes';
import {
  LoadDataMethod,
  getOpportunityName,
  withTable,
} from '@app/client/shared/util';
import { OpportunityData } from '@app/rvns-opportunities';
import { signalStore, withComputed, withMethods } from '@ngrx/signals';
import { Store } from '@ngrx/store';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import { GridModule } from '@progress/kendo-angular-grid';
import { map } from 'rxjs';

export type OpportunityRow = OpportunityData & {
  // status: {
  //   name: string;
  //   color: string;
  // };
};

export const organisationOpportunitiesStore = signalStore(
  withComputed((store, ngrxStore = inject(Store)) => ({
    additionalParams: computed(() => ({
      domain:
        ngrxStore.selectSignal(organisationsQuery.selectCurrentOrganisation)()
          ?.domains[0] ?? '',
    })),
  })),
  withMethods(
    (
      store,
      ngrxStore = inject(Store),
      opportunityService = inject(OpportunitiesService),
    ) => ({
      loadData: <LoadDataMethod<OpportunityData>>((params) => {
        return opportunityService.getOpportunities(params).pipe(
          map(({ data }) => ({
            data:
              data?.items.filter(({ stage }) =>
                ['preliminary', 'dd', 'ic', 'pass', 'lost', 'portfolio'].some(
                  (allowedStage) =>
                    stage.displayName.toLowerCase().includes(allowedStage),
                ),
              ) ?? [],
            total: data!.total,
          })),
        );
      }),
    }),
  ),
  withTable<OpportunityData>({
    refreshOnActions: [
      OpportunitiesActions.createOpportunitySuccess,
      OpportunitiesActions.updateOpportunitySuccess,
    ],
  }),
  withComputed((store, ngrxStore = inject(Store)) => ({
    data: computed(() => {
      const statusDictionary = ngrxStore.selectSignal(
        pipelinesQuery.selectStagePrimaryColorDictionary,
      )();

      return {
        ...store.data(),
        data: store.data().data.map((opportunity) => ({
          ...opportunity,
          status: {
            name: opportunity!.stage?.displayName ?? '',
            color: statusDictionary?.[opportunity!.stage?.id] ?? '#000',
          },
        })),
      };
    }),
  })),
);

@Component({
  selector: 'app-organisation-opportunities-v2',
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
    NgClass,
  ],
  templateUrl: './organisation-opportunities-v2.component.html',
  styleUrls: ['./organisation-opportunities-v2.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [organisationOpportunitiesStore],
})
export class OrganisationOpportunitiesV2Component {
  public signalStore = inject(organisationOpportunitiesStore);

  public getOpportunityName(dataItem: OpportunityData) {
    return getOpportunityName(dataItem);
  }
}
