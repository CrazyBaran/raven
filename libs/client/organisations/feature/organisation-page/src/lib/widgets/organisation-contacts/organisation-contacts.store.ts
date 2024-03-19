import { inject } from '@angular/core';
import { LoadDataMethod, withInfiniteTable } from '@app/client/shared/util';
import { routerQuery } from '@app/client/shared/util-router';
import { signalStore, withMethods } from '@ngrx/signals';
import { Store } from '@ngrx/store';
import { map } from 'rxjs';
import {
  OrganisationContact,
  OrganisationsService,
} from '../../../../../../data-access/src';

export const organisationContactsStore = signalStore(
  withMethods(
    (
      store,
      organisationsService = inject(OrganisationsService),
      ngrxStore = inject(Store),
    ) => ({
      loadData: <LoadDataMethod<OrganisationContact>>((params) =>
        organisationsService
          .getContacts(
            ngrxStore.selectSignal(routerQuery.selectCurrentOrganisationId)()!,
            params,
          )
          .pipe(
            map((response) => ({
              total: response.data?.total ?? 0,
              data: response.data?.items ?? [],
            })),
          )),
    }),
  ),
  withInfiniteTable<OrganisationContact>({
    take: 10,
    defaultAmountOfRecords: 4,
  }),
);
