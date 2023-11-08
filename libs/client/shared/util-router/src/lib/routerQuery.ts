import { selectQueryParam, selectRouteParam } from './router.selectors';

const selectCurrentOrganisationId = selectRouteParam('companyId');
const selectCurrentOpportunityId = selectRouteParam('opportunityId');

const selectActiveLine = selectQueryParam('line');
const selectActiveType = selectQueryParam('type');

const selectActiveNoteId = selectQueryParam('noteId');

export const routerQuery = {
  selectCurrentOrganisationId,
  selectCurrentOpportunityId,
  selectActiveLine,
  selectActiveType,
  selectActiveNoteId,
};
