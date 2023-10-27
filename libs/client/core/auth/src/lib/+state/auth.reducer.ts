import { Action, createReducer } from '@ngrx/store';

import { ShareData } from '@app/rvns-acl';
import { UserData } from '@app/rvns-api';

export const AUTH_FEATURE_KEY = 'auth';

export interface AuthState {
  isLoading: boolean;
  isPending: boolean;
  user: UserData | null;
  acl: ShareData[] | null;
  error?: string | null;
}

export interface AuthPartialState {
  readonly [AUTH_FEATURE_KEY]: AuthState;
}

export const initialAuthState: AuthState = {
  user: null,
  isLoading: false,
  isPending: false,
  acl: null,
  error: null,
};

const reducer = createReducer(initialAuthState);

export function authReducer(
  state: AuthState | undefined,
  action: Action,
): AuthState {
  return reducer(state, action);
}
