import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { of,  Observable } from 'rxjs';
import { map, timeout, retry, switchMap, toArray } from 'rxjs/operators';

import { LocalUser } from '../shared/models/local-user.model';

import { AppState, selectLocalUsers } from '../../store';
import { CUDLocalUserSuccessPayloadModel, CUDSuccessActions } from '../../store/local-users/actions';
import { LocalStorage } from '@ngx-pwa/local-storage';
import { Store, select } from '@ngrx/store';

@Injectable()
export class LocalUserService {

  /**
   * List of users saved on local storage
   */
  users: Array<LocalUser>;

  /**
   * The endpoint to "save" the users
   */
  private readonly usersEndpoint = 'https://reqres.in/api/users/';

  constructor(
    private http: HttpClient,
    private localStorageService: LocalStorage,
    private store: Store<AppState>
  ) {
    // Get the local users from the store
    this.store.pipe(select(selectLocalUsers))
      .subscribe((users) => {
        this.users = users;
      });
  }

  /**
   * Do the post to know the user ID, then, save the users on the local
   * storage
   *
   * @param user The user to save
   * @returns {Observable<CUDLocalUserSuccessPayloadModel>}
   */
  saveUser(user: LocalUser): Observable<CUDLocalUserSuccessPayloadModel> {
    return this.http.post(this.usersEndpoint, { }).pipe(
      // give it 3seconds to make the operation
      timeout(3000),
      // Retry the operation 3 times on error
      retry(3),
      // Save the user on local storage
      switchMap((resp: any) => {
        user.id = resp.id;
        user.setCreatedAt(resp.createdAt);
        // first time user creation the updated at will be same as created at date
        user.setUpdatedAt(resp.createdAt);

        // Make a clone of the users and assign the new user
        const localUsers = this.users.slice();
        // Insert new user
        localUsers.push(user);

        // Save on local storage
        return this.localStorageService.setItem('users', localUsers);
      }),
      map(() => <CUDLocalUserSuccessPayloadModel>{
        CUDUser: user,
        CUDAction: CUDSuccessActions.Create,
        users: [ ...this.users, user ]
      })
    );
  }

  /**
   * Delete a user from local storage
   *
   * @param userToDelete User to Delete
   * @returns {Observable<CUDLocalUserSuccessPayloadModel>}
   */
  deleteUser(userToDelete: LocalUser): Observable<CUDLocalUserSuccessPayloadModel> {
    let newUsersArray: Array<LocalUser>;

    return this.http.delete(`${this.usersEndpoint}${userToDelete.id}`, {}).pipe(
      // give it 3seconds to make the operation
      timeout(3000),
      // Retry the operation 3 times on error
      retry(3),
      // Remove the user on local storage
      switchMap(() => {
        // Make a clone of the users and remove the user
        newUsersArray = this.users.filter((user: LocalUser) => user.id !== userToDelete.id);

        // Save the array with the user removed on local storage
        return this.localStorageService.setItem('users', newUsersArray);
      }),
      map(() => <CUDLocalUserSuccessPayloadModel>{
        CUDUser: userToDelete,
        CUDAction: CUDSuccessActions.Delete,
        users: newUsersArray
      })
    );
  }

  /**
   * Update a user from local storage
   *
   * @param userToUpdate User to Delete
   *
   * @returns {Observable<CUDLocalUserSuccessPayloadModel>}
   */
  updateUser(userToUpdate: LocalUser): Observable<CUDLocalUserSuccessPayloadModel> {
    let newUsersArray: Array<LocalUser>;

    return this.http.put(this.usersEndpoint, {}).pipe(
      // give it 3seconds to make the operation
      timeout(3000),
      // Retry the operation 3 times on error
      retry(3),
      // Save the user on local storage
      switchMap((resp: any) => {
        // Update updated at date
        userToUpdate.setUpdatedAt(resp.updatedAt);

        // Get the index of the user to be edited
        const index = this.users.findIndex((user: LocalUser) => user.id === userToUpdate.id);

        newUsersArray = [...this.users];
        newUsersArray[index] = userToUpdate;

        // Update on local storage
        return this.localStorageService.setItem('users', newUsersArray);
      }),
      map(() => <CUDLocalUserSuccessPayloadModel>{
        CUDUser: userToUpdate,
        CUDAction: CUDSuccessActions.Update,
        users: newUsersArray
      })
    );
  }

  /**
   * Load the users form the local storage and assign them to
   * our array of users
   */
  loadLocalUsers(): Observable<LocalUser[]> {
    // Load the stored users
    return this.localStorageService.getItem<Array<LocalUser>>('users').pipe(
      // Return only one user of the users gotten or an empty array if there is any user
      switchMap((localUsers: Array<LocalUser>) => localUsers ? localUsers : []),
      // Transform the user from simple json to our model
      map((localUser: LocalUser) => new LocalUser(localUser)),
      // Collect all the users in an array
      toArray());
  }

  /**
   * Verify if an email already exits
   *
   * @param emailToCheck The email to verify if exits
   * @returns {boolean} True - some user already have that email
   *                    False - no one has it
   */
  doesEmailExists(emailToCheck: string) {
    // return true; // useful to debug
    return this.users
      // Pass only the email of the local users
      .map((localUser: LocalUser) => localUser.email)
      // Filter only the email
      .some((userEmail) => userEmail === emailToCheck);
  }
}
