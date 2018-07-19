import { Action } from '@ngrx/store';
import { LocalUser } from '../../users/shared/models/local-user.model';

export const CREATE_LOCAL_USER = '[Local Users] Create';

export const READ_LOCAL_USERS = '[Local Users] Read';
export const READ_LOCAL_USERS_SUCCESS = '[Local Users] Read Success';

export const UPDATE_LOCAL_USER = '[Local Users] Update';

export const DELETE_LOCAL_USER = '[Local Users] Delete';

export const CUD_LOCAL_USER_SUCCESS = '[Local Users] CUD Success';
export const CUD_LOCAL_USER_FAILED = '[Local Users] CUD Failed';

/**
 * Action to create an user
 *
 * @export
 * @class CreateLocalUser
 * @implements {Action}
 */
export class CreateLocalUser implements Action {
  readonly type = CREATE_LOCAL_USER;

  constructor(public payload: LocalUser) { }
}

/**
 * Action to read users from the local storage
 *
 * @export
 * @class ReadLocalUsers
 * @implements {Action}
 */
export class ReadLocalUsers implements Action {
  readonly type = READ_LOCAL_USERS;

  constructor() { }
}

/**
 * Action to set read users from local storage in the state
 *
 * @export
 * @class ReadLocalUsersSuccess
 * @implements {Action}
 */
export class ReadLocalUsersSuccess implements Action {
  readonly type = READ_LOCAL_USERS_SUCCESS;

  constructor(public payload: LocalUser[]) { }
}

/**
 * Action to update an user
 *
 * @export
 * @class UpdateLocalUser
 * @implements {Action}
 */
export class UpdateLocalUser implements Action {
  readonly type = UPDATE_LOCAL_USER;

  constructor(public payload: LocalUser) { }
}

/**
 * Action to delete users from the local storage
 *
 * @export
 * @class ReadLocalUsers
 * @implements {Action}
 */
export class DeleteLocalUser implements Action {
  readonly type = DELETE_LOCAL_USER;

  constructor(public payload: LocalUser) { }
}

/**
 * An action to englobe a user Created, Updated or Deleted success
 *
 * @export
 * @class CUDLocalUserSuccess
 * @implements {Action}
 */
export class CUDLocalUserSuccess implements Action {
  readonly type = CUD_LOCAL_USER_SUCCESS;

  constructor(public payload: CUDLocalUserSuccessPayloadModel) { }
}

/**
 * Action to indicate that a CUD error occurred
 *
 * @export
 * @class CUDLocalUserFailed
 * @implements {Action}
 */
export class CUDLocalUserFailed implements Action {
  readonly type = CUD_LOCAL_USER_FAILED;

  constructor() { }
}

export interface CUDLocalUserSuccessPayloadModel {
  /**
   * This could be read like
   * Created | Updated | Delete - User
   *
   * @type {LocalUser}
   * @memberof CUDLocalUserSuccessPayloadModel
   */
  CUDUser: LocalUser;
  /**
   * The new array of users after the CUD operations
   *
   * @type {Array<LocalUser>}
   * @memberof CUDLocalUserSuccessPayloadModel
   */
  users: Array<LocalUser>;
  /**
   * The CUD operation performed
   *
   * @type {CUDSuccessActions}
   * @memberof CUDLocalUserSuccessPayloadModel
   */
  CUDAction: CUDSuccessActions;
}

export enum CUDSuccessActions {
  Create,
  Update,
  Delete
}

export type All =
  CreateLocalUser |
  ReadLocalUsers |
  ReadLocalUsersSuccess |
  UpdateLocalUser |
  DeleteLocalUser |
  CUDLocalUserSuccess |
  CUDLocalUserFailed;
