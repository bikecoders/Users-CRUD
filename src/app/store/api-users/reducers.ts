import * as ApiUserActions from './actions';
import { ApiUser, ApiUserResponse, Pagination } from '../../users/shared/models/api-user.model';

export interface ApiUsersState {
  /**
   * Users of the current page
   *
   * @type {ApiUser[]}
   * @memberof ApiUsersState
   */
  users: ApiUser[];
  /**
   * Indicates when the users are being fetch from the api
   *
   * @type {boolean}
   * @memberof ApiUsersState
   */
  loading: boolean;
  /**
   * Tracks the pagination in the users list
   *
   * @type {Pagination}
   * @memberof ApiUsersState
   */
  pagination: Pagination;
  /**
   * Error ocurred while fetching users from API
   *
   * @type {Error}
   * @memberof ApiUsersState
   */
  errorOnFetching?: Error;
}

export const initialApiUsersState: ApiUsersState = {
  users: [],
  loading: false,
  pagination: {
    page: 1,
    per_page: 3
  }
};

export function apiUsersReducer(state = initialApiUsersState, action: ApiUserActions.All): ApiUsersState {
  switch (action.type) {
    case ApiUserActions.FETCH_USERS_API: {
      return {
        ...state,
        pagination: {
          ...state.pagination,
          page: action.payload.page,
          per_page: action.payload.per_page
        },
        loading: true
      };
    }

    case ApiUserActions.FETCH_USERS_API_SUCCESS: {
      const payload: ApiUserResponse = action.payload;
      return {
        ...state,
        users: payload.data,
        pagination: {
          ...state.pagination,
          total: payload.total,
          total_pages: payload.total_pages
        },
        loading: false
      };
    }

    case ApiUserActions.FETCH_USERS_API_FAILED: {
      const payload: Error = action.payload;
      return {
        ...state,
        errorOnFetching: payload,
        loading: false
      };
    }

    default: {
      return state;
    }
  }
}
