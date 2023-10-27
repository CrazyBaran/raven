import { createActionGroup, emptyProps } from '@ngrx/store';

export const ShelfActions = createActionGroup({
  source: 'Shelf',
  events: {
    'Open Notepad': emptyProps(),
  },
});
