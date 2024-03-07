/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { organisationsFeature } from '@app/client/organisations/state';
import { pipelinesQuery } from '@app/client/pipelines/state';
import { routerQuery } from '@app/client/shared/util-router';
import { createSelector } from '@ngrx/store';

export const selectOrganisationOpportunitiesViewModel = createSelector(
  organisationsFeature.selectCurrentOrganisation,
  routerQuery.selectCurrentOrganisationId,
  organisationsFeature.selectLoadingOrganisation,
  pipelinesQuery.selectStagePrimaryColorDictionary,
  (
    currentOrganisation,
    currentOrganisationId,
    isLoading,
    stageColorDictionary,
  ) => {
    const opportunities =
      currentOrganisation?.opportunities
        ?.filter(({ stage }) =>
          ['preliminary', 'dd', 'ic', 'pass', 'lost', 'won'].some(
            (allowedStage) =>
              stage.displayName.toLowerCase().includes(allowedStage),
          ),
        )
        .map((opportunity) => ({
          ...opportunity,
          status: {
            name: opportunity!.stage?.displayName ?? '',
            color: stageColorDictionary?.[opportunity!.stage?.id] ?? '#000',
          },
        })) ?? [];

    return {
      currentOrganisationId,
      isLoading,
      opportunities,
    };
  },
);
