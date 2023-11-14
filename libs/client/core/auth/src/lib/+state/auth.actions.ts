import { createActionGroup, props } from '@ngrx/store';

export const AuthActions = createActionGroup({
  source: 'Auth/API',
  events: {
    'Sync Auth State': props<{ email: string; name: string }>(),
  },
});
