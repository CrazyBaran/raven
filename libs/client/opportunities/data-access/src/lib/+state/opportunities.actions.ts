import { createActionGroup, emptyProps, props } from '@ngrx/store';

import { Params } from '@angular/router';
import { OpportunityData, OpportunityTeamData } from '@app/rvns-opportunities';
import {
  CreateOpportunity,
  OpportunityChanges,
} from '../services/opportunities.service';

export const OpportunitiesActions = createActionGroup({
  source: 'Opportunities/API',
  events: {
    'Get Opportunities': props<{ params: Params }>(),
    'Get Opportunities Success': props<{ data: OpportunityData[] }>(),
    'Get Opportunities Failure': props<{ error: string }>(),

    'Update Opportunity': props<{
      id: string;
      changes: OpportunityChanges;
    }>(),
    'Update Opportunity Failure': props<{ error: unknown }>(),
    'Update Opportunity Success': props<{ data: OpportunityData }>(),

    'Update Opportunity Team': props<{
      id: string;
      payload: {
        owners: string[];
        members: string[];
      };
      method: 'patch' | 'post';
    }>(),
    'Update Opportunity Team Failure': props<{ error: unknown }>(),
    'Update Opportunity Team Success': props<{
      id: string;
      data: OpportunityTeamData;
    }>(),

    'Get Opportunity Details': props<{ id: string }>(),
    'Get Opportunity Details Success': props<{
      data: OpportunityData | null;
    }>(),
    'Get Opportunity Details Failure': props<{ error: unknown }>(),

    'Change Opportunity Pipeline Stage': props<{
      id: string;
      pipelineStageId: string;
    }>(),
    'Change Opportunity Pipeline Stage Success': props<{
      data: OpportunityData | null;
    }>(),
    'Change Opportunity Pipeline Stage Failure': props<{
      id: string;
      prevPipelineStageId: string;
      error: unknown;
    }>(),

    'Live Change Opportunity Pipeline Stage': props<{
      id: string;
      pipelineStageId: string;
    }>(),

    'Live Change Opportunity Pipeline Stage Updated': props<{
      id: string;
      pipelineStageId: string;
    }>(),

    'Open Opportunity Dialog Form': emptyProps,

    'Create Opportunity': props<{ payload: CreateOpportunity }>(),
    'Create Opportunity Success': props<{ data: OpportunityData }>(),
    'Create Opportunity Failure': props<{ error: unknown }>(),

    'Reopen Opportunity': props<{
      id: string;
    }>(),
    'Reopen Opportunity Failure': props<{ error: unknown }>(),
    'Reopen Opportunity Success': props<{ data: OpportunityData }>(),
  },
});
