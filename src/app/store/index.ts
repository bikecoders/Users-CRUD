import { ApiUsersState, apiUsersReducer, initialApiUsersState } from './api-users/reducers';
import { ActionReducerMap, createSelector } from '@ngrx/store';
import { LocalUsersState, localUserReducer } from './local-users/reducers';


export interface AppState {
  apiUsers: ApiUsersState;
  localUsers: LocalUsersState;
}

export const reducers: ActionReducerMap<AppState> = {
  apiUsers: apiUsersReducer,
  localUsers: localUserReducer
};

// Api-users selectors
export const selectApiUsersFeature = (state: AppState) => state.apiUsers;
export const selectApiUsersLoading = createSelector(
  selectApiUsersFeature,
  (state: ApiUsersState) => state.loading
);

export const selectApiUsers = createSelector(
  selectApiUsersFeature,
  (state: ApiUsersState) => state.users
);

export const selectApiUsersListPagination = createSelector(
  selectApiUsersFeature,
  (state: ApiUsersState) => state.pagination
);

export const selectApiUsersErrorOnFetching = createSelector(
  selectApiUsersFeature,
  (state: ApiUsersState) => state.errorOnFetching
);


// Local Users selectors
export const selectLocalUsersFeature = (state: AppState) => state.localUsers;
export const selectLocalUsersLoadingCUD = createSelector(
  selectLocalUsersFeature,
  (state: LocalUsersState) => state.loadingCUD
);


export const selectLocalUsersLoadingReading = createSelector(
  selectLocalUsersFeature,
  (state: LocalUsersState) => state.loadingReading
);

export const selectLocalUsers = createSelector(
  selectLocalUsersFeature,
  (state: LocalUsersState) => state.users
);

export const selectLocalUserCreated = createSelector(
  selectLocalUsersFeature,
  (state: LocalUsersState) => state.userCreated
);

export const selectLocalUserUpdated = createSelector(
  selectLocalUsersFeature,
  (state: LocalUsersState) => state.userUpdated
);

export const selectLocalUserDeleted = createSelector(
  selectLocalUsersFeature,
  (state: LocalUsersState) => state.userDeleted
);
