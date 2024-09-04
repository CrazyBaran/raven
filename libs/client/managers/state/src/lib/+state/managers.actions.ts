import {
  CreateContactDto,
  GetManagersDto,
  UpdateManagerDto,
} from '@app/client/managers/data-access';
import { FailurePayload, SuccessPayload } from '@app/client/shared/util';
import {
  FundManagerContactData,
  FundManagerData,
} from '@app/rvns-fund-managers';
import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { PagedData } from 'rvns-shared';

export const ManagersActions = createActionGroup({
  source: 'Managers/API',
  events: {
    'Open Managers Table': emptyProps(),

    'Get Managers': props<{ query?: GetManagersDto }>(),
    'Get Managers Success': props<SuccessPayload<PagedData<FundManagerData>>>(),
    'Get Managers Failure': props<FailurePayload>(),

    'Load More Managers': props<{ query?: GetManagersDto }>(),
    'Load More Managers Success':
      props<SuccessPayload<PagedData<FundManagerData>>>(),
    'Load More Managers Failure': props<FailurePayload>(),

    'Get Manager': props<{ id: string }>(),
    'Get Manager Success': props<SuccessPayload<FundManagerData>>(),
    'Get Manager Failure': props<FailurePayload>(),

    'Get Manager If Not Loaded': props<{ id: string }>(),

    'Update Manager': props<{ id: string; changes: UpdateManagerDto }>(),
    'Update Manager Success': props<SuccessPayload<FundManagerData>>(),
    'Update Manager Failure': props<FailurePayload>(),

    'Get Manager Contact': props<{ id: string }>(),
    'Get Manager Contact Success':
      props<SuccessPayload<FundManagerContactData>>(),
    'Get Manager Contact Failure': props<FailurePayload>(),

    'Create Manager Contact': props<{
      id: string;
      data: CreateContactDto;
    }>(),
    'Create Manager Contact Success':
      props<SuccessPayload<FundManagerContactData>>(),
    'Create Manager Contact Failure': props<FailurePayload>(),

    'Update Manager Contact': props<{
      id: string;
      changes: Partial<CreateContactDto>;
    }>(),
    'Update Manager Contact Success':
      props<SuccessPayload<FundManagerContactData>>(),
    'Update Manager Contact Failure': props<FailurePayload>(),

    'Remove Manager Contact': props<{
      id: string;
    }>(),
    'Remove Manager Contact Success': props<SuccessPayload<boolean>>(),
    'Remove Manager Contact Failure': props<FailurePayload>(),
  },
});
