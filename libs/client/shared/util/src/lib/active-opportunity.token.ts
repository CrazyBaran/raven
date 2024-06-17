import { InjectionToken, inject } from '@angular/core';
import { Observable, map, of } from 'rxjs';
import { CompanyStatus } from '../../../../../rvns-shared/src';
import { OrganisationsService } from '../../../../organisations/data-access/src';

export const ACTIVE_OPPORTUNITY_SOURCE = new InjectionToken(
  'Reminder Active Opportunity Source',
  {
    providedIn: 'root',
    factory: (): ((organisationId: string) => Observable<any>) => {
      const organisationsService = inject(OrganisationsService);
      return (organisationId) =>
        organisationId
          ? organisationsService.getOrganisation(organisationId).pipe(
              map(({ data }) => {
                const activeStatuses = [CompanyStatus.LIVE_OPPORTUNITY];
                if (
                  activeStatuses.includes(data?.companyStatus!) &&
                  data?.opportunities?.length
                ) {
                  return data.opportunities[0];
                }

                return null;
              }),
            )
          : of(null);
    },
  },
);
