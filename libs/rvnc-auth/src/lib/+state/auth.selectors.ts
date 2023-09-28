import { createFeatureSelector, createSelector } from '@ngrx/store';

import { RoleEnum } from '@app/rvns-roles';

import { AUTH_FEATURE_KEY, AuthState } from './auth.reducer';

export const getAuthState = createFeatureSelector<AuthState>(AUTH_FEATURE_KEY);

export const selectUserData = createSelector(
  getAuthState,
  (state: AuthState) => state.user,
);
