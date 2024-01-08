import {
  CreateOrganisation,
  Organisation,
  OrganisationsResponse,
} from '@app/client/organisations/data-access';

//TODO: QUICK FIX FOR DEMO, Remove this dependency
// eslint-disable-next-line @nx/enforce-module-boundaries
import { OpportunityData } from '@app/rvns-opportunities';
import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { OrganisationEntity } from './organisations.model';

export const OrganisationsActions = createActionGroup({
  source: 'Organisations/API',
  events: {
    'Get Organisation': props<{ id: OrganisationEntity['id'] }>(),
    'Get Organisation Success': props<{
      data: OrganisationEntity | undefined;
    }>(),
    'Get Organisation Failure': props<{ error: string }>(),

    'Get Organisations': emptyProps(),
    'Get Organisations Success': props<{ data: OrganisationsResponse }>(),
    'Get Organisations Failure': props<{ error: string }>(),

    'Create Organisation': props<{ data: CreateOrganisation }>(),
    'Create Organisation Success': props<{
      data: Organisation;
    }>(),
    'Create Organisation Failure': props<{ error: string }>(),

    'Create Organisation SharepointFolder': props<{
      id: string;
    }>(),
    'Create Organisation SharepointFolder Success': props<{
      data: Organisation;
    }>(),
    'Create Organisation SharepointFolder Failure': props<{ error: string }>(),

    'Add Opportunity to Organisation': props<{
      id: string;
      opportunityId: string;
      opportunity?: OpportunityData;
    }>(),
  },
});

export const OrganisationsUrlActions = createActionGroup({
  source: 'Organisations/URL',
  events: {
    'Query Params Changed': props<{
      params: Record<string, string | string[]>;
    }>(),
    'Fetched Table items': props<{ ids: string[] }>(),
  },
});
