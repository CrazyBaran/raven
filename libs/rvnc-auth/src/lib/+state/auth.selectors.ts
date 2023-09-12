import { createFeatureSelector, createSelector } from '@ngrx/store';

import { RoleEnum } from '@app/rvns-roles';

import { AUTH_FEATURE_KEY, AuthState } from './auth.reducer';

export const getAuthState = createFeatureSelector<AuthState>(AUTH_FEATURE_KEY);

export const selectUserData = createSelector(
  getAuthState,
  (state: AuthState) => state.user
);

export const selectUserId = createSelector(selectUserData, (user) => user?.id);

export const selectAuthError = createSelector(
  getAuthState,
  (state: AuthState) => state.error
);

export const selectAuthIsPending = createSelector(
  getAuthState,
  (state: AuthState) => state.isPending || false
);

export const selectAuthLoading = createSelector(
  getAuthState,
  (state: AuthState) => state.isLoading || false
);

export const selectProfileAcl = createSelector(
  getAuthState,
  (state: AuthState) => state.acl
);

export const selectUserAuthMode = createSelector(
  getAuthState,
  (state: AuthState) => state.user?.authMode
);

export const selectUserRoles = createSelector(
  selectUserData,
  (user) => user?.roles
);

export const selectIsSuperAdmin = createSelector(selectUserRoles, (roles) =>
  roles?.includes(RoleEnum.SuperAdmin)
);

export const selectUserTeamId = createSelector(
  selectUserData,
  (user) => user?.teamId
);
