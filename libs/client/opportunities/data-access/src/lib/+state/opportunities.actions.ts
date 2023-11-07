import { createActionGroup, emptyProps, props } from '@ngrx/store';

import { OpportunityData } from '@app/rvns-opportunities';

export const OpportunitiesActions = createActionGroup({
  source: 'Opportunities/API',
  events: {
    'Get Opportunities': props<{ take: number; skip: number }>(),
    'Get Opportunities Success': props<{ data: OpportunityData[] }>(),
    'Get Opportunities Failure': props<{ error: string }>(),

    'Get Opportunity Details': props<{ id: string }>(),
    'Get Opportunity Details Success': props<{
      data: OpportunityData | null;
    }>(),
    'Get Opportunity Details Failure': props<{ error: string }>(),

    'Change Opportunity Pipeline Stage': props<{
      id: string;
      pipelineStageId: string;
    }>(),
    'Change Opportunity Pipeline Stage Success': props<{
      data: OpportunityData | null;
    }>(),
    'Change Opportunity Pipeline Stage Failure': props<{ error: string }>(),

    'Clear Opportunities': emptyProps(),
    'Clear Opportunity Details': emptyProps(),
  },
});
