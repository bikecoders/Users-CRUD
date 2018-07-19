import { Action } from '@ngrx/store';
import { ApiUserResponse, Pagination } from '../../users/shared/models/api-user.model';

export const FETCH_USERS_API = '[Api Users] Fetch';
export const FETCH_USERS_API_SUCCESS = '[Api Users] Fetched';
export const FETCH_USERS_API_FAILED = '[Api Users] Fetched Failed';

/**
 * Action to fetch users from API indicating a page number
 *
 * @export
 * @class FetchUsersApi
 * @implements {Action}
 */
export class FetchUsersApi implements Action {
  readonly type = FETCH_USERS_API;

  constructor(public payload: Pagination) { }
}

/**
 * Action to set users fetched from API in the state
 *
 * @export
 * @class FetchUsersApiSuccess
 * @implements {Action}
 */
export class FetchUsersApiSuccess implements Action {
  readonly type = FETCH_USERS_API_SUCCESS;

  constructor(public payload: ApiUserResponse) { }
}

/**
 * Action to indicate when users fetched from API has failed
 *
 * @export
 * @class FetchUsersApiFailed
 * @implements {Action}
 */
export class FetchUsersApiFailed implements Action {
  readonly type = FETCH_USERS_API_FAILED;

  constructor(public payload: Error) { }
}


export type All =
  FetchUsersApi |
  FetchUsersApiSuccess |
  FetchUsersApiFailed;
