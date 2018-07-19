import { Injectable } from '@angular/core';

import { Action } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';

import { Observable, of } from 'rxjs';
import { mergeMap, map, catchError } from 'rxjs/operators';

import { LocalUserService } from '../../users/shared/local-user.service';
import {
  CREATE_LOCAL_USER,
  CreateLocalUser,
  CUDLocalUserSuccess,
  READ_LOCAL_USERS,
  ReadLocalUsers,
  ReadLocalUsersSuccess,
  DELETE_LOCAL_USER,
  DeleteLocalUser,
  CUDLocalUserSuccessPayloadModel,
  UpdateLocalUser,
  UPDATE_LOCAL_USER,
  CUDLocalUserFailed,
} from './actions';

@Injectable()
export class LocalUsersEffects {

  // Listen for the 'CREATE_LOCAL_USERS' action
  @Effect()
  createUserOnLocal$: Observable<Action> = this.actions$.pipe(
    ofType(CREATE_LOCAL_USER),
    mergeMap((action: CreateLocalUser) =>
      this.localUserService.saveUser(action.payload).pipe(
        // If successful, dispatch success action with the user created
        map((payload: CUDLocalUserSuccessPayloadModel) => new CUDLocalUserSuccess(payload)),
        catchError(() => of(new CUDLocalUserFailed()))
      )
    )
  );

  // Listen for the 'READ_LOCAL_USERS' action
  @Effect()
  readUsersFromLocal$: Observable<Action> = this.actions$.pipe(
    ofType(READ_LOCAL_USERS),
    mergeMap((action: ReadLocalUsers) =>
      this.localUserService.loadLocalUsers().pipe(
        // If successful, dispatch success action with result
        map(users => new ReadLocalUsersSuccess(users)),
      )
    )
  );

  // Listen for the 'UPDATE_LOCAL_USERS' action
  @Effect()
  updateUsersFromLocal$: Observable<Action> = this.actions$.pipe(
    ofType(UPDATE_LOCAL_USER),
    mergeMap((action: UpdateLocalUser) =>
      this.localUserService.updateUser(action.payload).pipe(
        // If successful, dispatch success action with result
        map((updateUserResult: CUDLocalUserSuccessPayloadModel) => new CUDLocalUserSuccess(updateUserResult)),
        catchError(() => of(new CUDLocalUserFailed()))
      )
    )
  );

  // Listen for the 'DELETE_LOCAL_USERS' action
  @Effect()
  deleteUserFromLocal$: Observable<Action> = this.actions$.pipe(
    ofType(DELETE_LOCAL_USER),
    mergeMap((action: DeleteLocalUser) =>
      this.localUserService.deleteUser(action.payload).pipe(
        // If successful, dispatch success action with result
        map((deleteUserResult: CUDLocalUserSuccessPayloadModel) => new CUDLocalUserSuccess(deleteUserResult)),
        catchError(() => of(new CUDLocalUserFailed()))
      )
    )
  );

  constructor(
    private actions$: Actions,
    private localUserService: LocalUserService
  ) { }
}
