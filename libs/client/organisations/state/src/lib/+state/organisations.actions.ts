import {
  CreateOrganisation,
  Organisation,
} from '@app/client/organisations/data-access';

import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { OrganisationEntity } from './organisations.model';

export const OrganisationsActions = createActionGroup({
  source: 'Organisations/API',
  events: {
    'Get Organisations': emptyProps(),
    'Get Organisations Success': props<{ data: OrganisationEntity[] }>(),
    'Get Organisations Failure': props<{ error: string }>(),

    'Create Organisation': props<{ data: CreateOrganisation }>(),
    'Create Organisation Success': props<{
      data: Organisation;
    }>(),
    'Create Organisation Failure': props<{ error: string }>(),
  },
});
