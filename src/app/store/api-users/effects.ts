import { Injectable } from '@angular/core';

import { Observable, of } from 'rxjs';
import { mergeMap, map, catchError } from 'rxjs/operators';

import { Action } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';

import { FETCH_USERS_API,
  FetchUsersApi,
  FetchUsersApiSuccess,
  FetchUsersApiFailed} from './actions';
import { ApiUserService } from '../../users/shared/api-user.service';


@Injectable()
export class ApiUsersEffects {
  // Listen for the 'FETCH_USERS_API' action
  @Effect()
  fetchUsersApi$: Observable<Action> = this.actions$.pipe(
    ofType(FETCH_USERS_API),
    mergeMap((action: FetchUsersApi) =>
      this.apiUserService.getUsers(action.payload).pipe(
        // If successful, dispatch success action with result
        map(data => new FetchUsersApiSuccess(data)),
        // If request fails, dispatch failed action
        catchError((error) => of(new FetchUsersApiFailed(error as Error)))
      )
    )
  );

  constructor(
    private actions$: Actions,
    private apiUserService: ApiUserService
  ) {}
}
