import { createActionGroup, props } from '@ngrx/store';

export const ShelfActions = createActionGroup({
  source: 'Shelf',
  events: {
    'Open Notepad': props<{
      organisationId?: string;
      opportunityId?: string;
    }>(),
    'Open Note Details': props<{ noteId: string }>(),
  },
});
