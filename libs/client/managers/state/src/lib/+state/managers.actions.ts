import { GetManagersDto } from '@app/client/managers/data-access';
import { FailurePayload } from '@app/client/shared/util';
import { FundManagerData } from '@app/rvns-fund-managers';
import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { PagedData } from 'rvns-shared';

export const ManagersActions = createActionGroup({
  source: 'Managers/API',
  events: {
    'Open Managers Table': emptyProps(),

    'Get Managers': props<{ query?: GetManagersDto }>(),
    'Get Managers Success': props<{ data: PagedData<FundManagerData> }>(),
    'Get Managers Failure': props<FailurePayload>(),

    'Load More Managers': props<{ query?: GetManagersDto }>(),
    'Load More Managers Success': props<{
      data: PagedData<FundManagerData>;
    }>(),
    'Load More Managers Failure': props<FailurePayload>(),
  },
});
