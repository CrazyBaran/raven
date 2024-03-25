import {
  CreateOrganisation,
  Organisation,
  OrganisationsResponse,
} from '@app/client/organisations/data-access';

//TODO: QUICK FIX FOR DEMO, Remove this dependency
// eslint-disable-next-line @nx/enforce-module-boundaries
import { FailurePayload } from '@app/client/shared/util';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { OpportunityData } from '@app/rvns-opportunities';
import { createActionGroup, emptyProps, props } from '@ngrx/store';
import {
  DataWarehouseLastUpdatedEntity,
  OrganisationEntity,
} from './organisations.model';

export const OrganisationsActions = createActionGroup({
  source: 'Organisations/API',
  events: {
    'Get Organisation': props<{ id: OrganisationEntity['id'] }>(),
    'Get Organisation Success': props<{
      data: OrganisationEntity | undefined;
    }>(),
    'Get Organisation Failure': props<FailurePayload>(),

    'Get Organisations': emptyProps(),
    'Get Organisations Success': props<{ data: OrganisationsResponse }>(),
    'Get Organisations Failure': props<FailurePayload>(),

    'Load More Organisations': props<{
      params: Record<string, number | string | string[]>;
    }>(),
    'Load More Organisations Success': props<{ data: OrganisationsResponse }>(),
    'Load More Organisations Failure': props<FailurePayload>(),

    'Refresh Organisations': emptyProps(),
    'Refresh Organisations Success': props<{ data: OrganisationsResponse }>(),
    'Refresh Organisations Failure': props<FailurePayload>(),

    'Create Organisation': props<{ data: CreateOrganisation }>(),
    'Create Organisation Success': props<{
      data: Organisation;
    }>(),
    'Create Organisation Failure': props<FailurePayload>(),

    'Update Organisation': props<{
      id: string;
      changes: Partial<OrganisationEntity>;
    }>(),
    'Update Organisation Failure': props<FailurePayload>(),
    'Update Organisation Success': props<{ data: Organisation }>(),

    'Create Organisation SharepointFolder': props<{
      id: string;
    }>(),
    'Create Organisation SharepointFolder Success': props<{
      data: Organisation;
    }>(),
    'Create Organisation SharepointFolder Failure': props<FailurePayload>(),

    'Add Opportunity to Organisation': props<{
      id: string;
      opportunityId: string;
      opportunity?: OpportunityData;
    }>(),

    'Get Data Warehouse Last Updated': emptyProps(),
    'Get Data Warehouse Last Updated Success': props<{
      data: DataWarehouseLastUpdatedEntity;
    }>(),
    'Get Data Warehouse Last Updated Failure': props<FailurePayload>(),

    'Get Data Warehouse Last Updated If Not Loaded': emptyProps(),

    'Open Organisations Table': emptyProps(),

    'Update Organisation Description': props<{
      id: string;
      customDescription: string;
    }>(),
    'Update Organisation Description Success': props<{
      data: Organisation;
    }>(),
    'Update Organisation Description Failure': props<FailurePayload>(),
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
