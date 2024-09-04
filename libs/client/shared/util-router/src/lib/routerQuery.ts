import { NOTE_DETAILS_QUERY_PARAM } from './query-params.const';
import { selectQueryParam, selectRouteParam } from './router.selectors';

const selectCurrentId = selectRouteParam('id');
const selectCurrentOrganisationId = selectRouteParam('organisationId');
const selectCurrentOpportunityId = selectRouteParam('opportunityId');

const selectActiveLine = selectQueryParam('line');
const selectActiveTab = selectQueryParam('tab');

const selectActiveNoteId = selectQueryParam('noteId');

const selectNoteDetailsId = selectQueryParam(NOTE_DETAILS_QUERY_PARAM);

export const routerQuery = {
  selectCurrentId,
  selectCurrentOrganisationId,
  selectCurrentOpportunityId,
  selectActiveLine,
  selectActiveTab,
  selectActiveNoteId,
  selectNoteDetailsId,
};

const selectNoteType = selectQueryParam('noteType');
const selectTagId = selectQueryParam('tagId');

export const notesRouterQuery = {
  selectNoteType,
  selectTagId,
};
