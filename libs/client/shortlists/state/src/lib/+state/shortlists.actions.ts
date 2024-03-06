import {
  BulkAddOrganisationsToShortlistDto,
  BulkRemoveFromShortlistDto,
  CreateShortlistDto,
  GetShortlistDto,
  UpdateShortlistDto,
} from '@app/client/shortlists/data-access';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { PagedShortlistDataWithExtras } from '@app/rvns-shortlists';
import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { ShortlistEntity } from './shortlists.model';

export type SuccessPayload<T> = { data: T; message?: string };
export type FailurePayload = { error: string; message?: string };

export const ShortlistsActions = createActionGroup({
  source: 'Shortlists/API',
  events: {
    'Get Shortlists': props<{ query?: GetShortlistDto }>(),
    'Get Shortlists Success': props<{ data: PagedShortlistDataWithExtras }>(),
    'Get Shortlists Failure': props<FailurePayload>(),

    'Get Shortlist': props<{ id: string }>(),
    'Get Shortlist Success': props<{ data: ShortlistEntity }>(),
    'Get Shortlist Failure': props<FailurePayload>(),

    'Get Shortlist Extras': emptyProps(),
    'Get Shortlist Extras Success': props<{ data: ShortlistEntity[] }>(),
    'Get Shortlist Extras Failure': props<FailurePayload>(),

    'Get Shorlist If Not Loaded': props<{ id: string }>(),

    'Bulk Add Organisations To Shortlist': props<{
      data: BulkAddOrganisationsToShortlistDto;
    }>(),
    'Bulk Add Organisations To Shortlist Success':
      props<SuccessPayload<BulkAddOrganisationsToShortlistDto>>(),
    'Bulk Add Organisations To Shortlist Failure': props<FailurePayload>(),

    'Bulk Remove Organisations From Shortlist': props<{
      data: BulkRemoveFromShortlistDto;
    }>(),
    'Bulk Remove Organisations From Shortlist Success':
      props<SuccessPayload<BulkRemoveFromShortlistDto>>(),
    'Bulk Remove Organisations From Shortlist Failure': props<FailurePayload>(),

    'Remove Organisation From My Shortlist': props<{
      organisationId: string;
    }>(),
    'Remove Organisation From My Shortlist Success':
      props<SuccessPayload<{ organisationId: string }>>(),
    'Remove Organisation From My Shortlist Failure': props<FailurePayload>(),

    'Delete Shortlist': props<{ id: string }>(),
    'Delete Shortlist Success': props<SuccessPayload<{ id: string }>>(),
    'Delete Shortlist Failure': props<FailurePayload>(),

    'Update Shortlist': props<{ id: string; changes: UpdateShortlistDto }>(),
    'Update Shortlist Success': props<SuccessPayload<ShortlistEntity>>(),
    'Update Shortlist Failure': props<FailurePayload>(),

    'Create Shortlist': props<{ data: CreateShortlistDto }>(),
    'Create Shortlist Success': props<SuccessPayload<ShortlistEntity>>(),
    'Create Shortlist Failure': props<FailurePayload>(),

    'Load More Shortlists': props<{ query?: GetShortlistDto }>(),
    'Load More Shortlists Success': props<{
      data: PagedShortlistDataWithExtras;
    }>(),
    'Load More Shortlists Failure': props<FailurePayload>(),

    'Open Shortlist Table': emptyProps(),
    'Open Shortlist Organisations Table': emptyProps(),
  },
});
