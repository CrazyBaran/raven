import { opportunitiesQuery } from '@app/client/opportunities/data-access';
import { organisationsFeature } from '@app/client/organisations/state';
import { remindersQuery } from '@app/client/reminders/state';
import { DialogUtil } from '@app/client/shared/util';
import { selectQueryParam } from '@app/client/shared/util-router';
import { tagsQuery } from '@app/client/tags/state';
import { OrganisationData } from '@app/rvns-opportunities';
import { createSelector } from '@ngrx/store';

export const selectCreateReminderParams = createSelector(
  selectQueryParam(DialogUtil.queryParams.createReminder),
  organisationsFeature.selectEntities,
  opportunitiesQuery.selectOpportunitiesDictionary,
  (
    params,
    organisations,
    opportunities,
  ): {
    organisation: OrganisationData | undefined;
    opportunity: any | undefined;
  } => {
    if (Array.isArray(params)) {
      const [organisationId, opportunityId] = params;
      return {
        organisation: organisations[organisationId],
        opportunity: opportunities[opportunityId]?.tag,
      };
    } else {
      return {
        organisation: undefined,
        opportunity: undefined,
      };
    }
  },
);
export const selectCreateReminderViewModel = createSelector(
  selectCreateReminderParams,
  remindersQuery.selectLoadingStates,
  tagsQuery.tagsFeature.selectOpportunityTags,
  tagsQuery.selectCurrentUserTag,
  (createParams, { create: isCreating }, opportunityTags, currentUser) => {
    return {
      isCreating,
      opportunityTags,
      currentUser: {
        id: currentUser?.userId ?? '',
        name: currentUser?.name ?? '',
      },
      createParams,
    };
  },
);
