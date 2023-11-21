import { createActionGroup, emptyProps, props } from '@ngrx/store';

export const ShelfActions = createActionGroup({
  source: 'Shelf',
  events: {
    'Open Notepad': emptyProps(),
    'Open Note Details': props<{ noteId: string }>(),
    'Open Opportunity Form': props<{ payload?: { organisationId?: string } }>(),
  },
});
