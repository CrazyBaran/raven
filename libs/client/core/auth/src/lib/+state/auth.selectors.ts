import { createFeatureSelector, createSelector } from '@ngrx/store';

import { AUTH_FEATURE_KEY, AuthState } from './auth.reducer';

export const getAuthState = createFeatureSelector<AuthState>(AUTH_FEATURE_KEY);

export const selectUserData = createSelector(
  getAuthState,
  (state: AuthState) => state.user,
);

export const selectUserId = createSelector(
  selectUserData,
  (state) => state?.id,
);

export const selectUserEmail = createSelector(
  selectUserData,
  (state) => state?.email,
);

export const selectUserName = createSelector(
  selectUserData,
  (state) => state?.name,
);

export const authQuery = {
  selectUserData,
  selectUserEmail,
  selectUserName,
  selectUserId,
};
