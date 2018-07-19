import { ChangeDetectionStrategy } from '@angular/core';
import { Component, OnInit, OnDestroy } from '@angular/core';

import { ApiUser, Pagination } from '../shared/models/api-user.model';
import { MatSnackBar } from '@angular/material';
import { PageEvent } from '@angular/material/paginator';

import { Observable } from 'rxjs/internal/Observable';
import { Subscription } from 'rxjs/internal/Subscription';
import { filter } from 'rxjs/operators';

import * as ApiUserActions from '../../store/api-users/actions';
import { AppState,
         selectApiUsers,
         selectApiUsersErrorOnFetching,
         selectApiUsersLoading } from '../../store/index';
import { Store, select } from '@ngrx/store';
import { selectApiUsersListPagination } from '../../store/index';


@Component({
  selector: 'app-api-users',
  templateUrl: './api-users.component.html',
  styleUrls: ['./api-users.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ApiUsersComponent implements OnInit, OnDestroy {
  /**
   * The different option of users per_page
   * available
   *
   * @type {number[]}
   * @memberof ApiUsersComponent
   */
  readonly pageSizeOptions: number[] = [2, 3, 4, 5];

  /**
   * Api users fetched from the API
   *
   * @type {Observable<Array<ApiUser>>}
   * @memberof ApiUsersComponent
   */
  users: Observable<Array<ApiUser>>;

  /**
   * To indicate if the component is loading
   *
   * @type {Observable<boolean>}
   * @memberof ApiUsersComponent
   */
  loading: Observable<boolean>;

  /**
   * Pagination information (total users and users per page)
   *
   * @type {Observable<Pagination>}
   * @memberof ApiUsersComponent
   */
  pagination: Observable<Pagination>;

  /**
   * Indicates the current page being loaded
   *
   * @type {Pagination}
   * @memberof ApiUsersComponent
   */
  currentPagination: Pagination;

  /**
   * Subscription to get the pagination from state and extract the current page from it
   *
   * @type {Subscription}
   * @memberof ApiUsersComponent
   */
  paginationSubs: Subscription;

  /**
  * Error ocurred when fetching users from API
  *
  * @type {Observable<Error>}
  * @memberof ApiUsersComponent
  */
  errorOnUsersFetching: Observable<Error>;

  /**
   * Subscription to get error ocurred when fetching users from API
   *
   * @type {Subscription}
   * @memberof ApiUsersComponent
   */
  errorOnUsersFetchingSubs: Subscription;

  constructor(
    private snackBar: MatSnackBar,
    private store: Store<AppState>
  ) {
    this.loading = this.store.pipe(select(selectApiUsersLoading));
    this.users = this.store.pipe(select(selectApiUsers));
    this.pagination = this.store.pipe(select(selectApiUsersListPagination));
    this.errorOnUsersFetching = this.store.pipe(
      select(selectApiUsersErrorOnFetching),
      filter(err => !!err)
    );

    // Get current page being loaded
    this.paginationSubs = this.pagination.subscribe((pagination: Pagination) => {
      this.currentPagination = pagination;
    });

    // What to do in case of error
    this.errorOnUsersFetchingSubs = this.errorOnUsersFetching
      .subscribe((err: Error) => {
        // Indicate the error
        const snackRef = this.snackBar.open('Connection Error', 'RETRY', {
          duration: 10000
        });

        // If the user clicks on retry call the function again to make the request
        snackRef.onAction()
          .subscribe(
          () => {
            // Try to fetch again the users from API
            this.store.dispatch(new ApiUserActions.FetchUsersApi(this.currentPagination));
          }
        );
      });

    this.store.dispatch(new ApiUserActions.FetchUsersApi(this.currentPagination));
  }

  ngOnInit() {}

  /**
   * Unsubscribe from the different selectors that we
   * use for bind the data that they are watching
   * and prevent memory leaks
   *
   * @memberof ApiUsersComponent
   */
  ngOnDestroy(): void {
    this.errorOnUsersFetchingSubs.unsubscribe();
    this.paginationSubs.unsubscribe();
  }

  /**
   * Catch the page change event of the paginator
   *
   * @param page The information about the current page
   */
  pageChanged(page: PageEvent) {
    const currentPagination: Pagination = {
      page: page.pageIndex + 1,
      per_page: page.pageSize
    };
    this.store.dispatch(new ApiUserActions.FetchUsersApi(currentPagination));
  }
}
