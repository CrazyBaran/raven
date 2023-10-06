import { createActionGroup, emptyProps, props } from '@ngrx/store';

import { OpportunityData } from '@app/rvns-opportunities';

export const OpportunitiesActions = createActionGroup({
  source: 'Opportunities/API',
  events: {
    'Get Opportunities': emptyProps(),
    'Get Opportunities Success': props<{ data: OpportunityData[] }>(),
    'Get Opportunities Failure': props<{ error: string }>(),

    'Clear Opportunities': emptyProps(),
  },
});
