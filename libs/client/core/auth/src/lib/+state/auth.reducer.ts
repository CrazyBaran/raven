import { Action, createReducer, on } from '@ngrx/store';

import { AuthActions } from './auth.actions';

export const AUTH_FEATURE_KEY = 'auth';

export interface AuthState {
  // isLoading: boolean;
  // isPending: boolean;
  user: Partial<{ email: string; name: string }> | null;
  // acl: ShareData[] | null;
  // error?: string | null;
}

export interface AuthPartialState {
  readonly [AUTH_FEATURE_KEY]: AuthState;
}

export const initialAuthState: AuthState = {
  user: {},
  // isLoading: false,
  // isPending: false,
  // acl: null,
  // error: null,
};

const reducer = createReducer(
  initialAuthState,

  on(AuthActions.syncAuthState, (state, { name, email }) => ({
    ...state,
    user: {
      ...state.user,
      name,
      email,
    },
  })),
);

export function authReducer(
  state: AuthState | undefined,
  action: Action,
): AuthState {
  return reducer(state, action);
}
