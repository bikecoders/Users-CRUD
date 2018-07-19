import { Component, OnInit, ViewChild } from '@angular/core';

import { MatTableDataSource, MatTable, MatDialog, MatSnackBar, MatDialogRef } from '@angular/material';

import { DeleteConfirmationComponent } from './delete-confirmation/delete-confirmation.component';
import { CreateEditUserComponent } from '../create-edit-user/create-edit-user.component';

import { LocalUser } from '../shared/models/local-user.model';

import { Observable } from 'rxjs';
import { Store, select } from '@ngrx/store';
import {
  AppState,
  selectLocalUserCUDFailed,
  selectLocalUserCUDSuccess,
  selectLocalUsers,
  selectLocalUsersLoadingReading
} from '../../store';
import { ReadLocalUsers, CUDSuccessActions } from '../../store/local-users/actions';
import { filter } from 'rxjs/operators';
import { CUDSuccessState } from '../../store/local-users/reducers';

@Component({
  selector: 'app-local-users',
  templateUrl: './local-users.component.html',
  styleUrls: ['./local-users.component.scss']
})
export class LocalUsersComponent implements OnInit {

  /**
   * Reference to the table
   */
  table: MatTable<LocalUser>;
  @ViewChild('table') set setNewTable(newTable: MatTable<LocalUser>) {
    this.table = newTable;
    this.updateRows();
  }

  /**
   * The columns of the table
   */
  readonly displayedColumns = [
    'fullName',
    'email',
    'phone',
    'birthDate',
    'age',
    'createdAt',
    'updatedAt',
    'actions',
  ];

  /**
   * To indicate if the component is loading
   *
   * @type {Observable<boolean>}
   * @memberof LocalUsersComponent
   */
  loading: Observable<boolean>;

  /**
   * The data source of the table
   */
  dataSource: MatTableDataSource<LocalUser>;

  /**
   * There list of users is Empty
   *
   * @type {boolean}
   * @memberof LocalUsersComponent
   */
  isEmpty: boolean;

  /**
   * A reference of the current dialog present
   *
   * @private
   * @type {MatDialogRef<CreateEditUserComponent>}
   * @memberof UsersComponent
   */
  private dialogRef: MatDialogRef<CreateEditUserComponent | DeleteConfirmationComponent>;

  constructor(
    private snackBar: MatSnackBar,
    private store: Store<AppState>,
    private dialog: MatDialog
  ) {
    this.loading = this.store.pipe(select(selectLocalUsersLoadingReading));

    this.store.pipe(select(selectLocalUsers))
      .subscribe((users) => {
        this.isEmpty = users.length === 0;
        this.dataSource = new MatTableDataSource(users);
      });

    this.store.dispatch(new ReadLocalUsers());

    // Subscribe to user created to close the modal and launch a toast to give feedback
    this.store.pipe(
      select(selectLocalUserCUDSuccess),
      // Ignore undefined values
      filter(userCUD => !!userCUD && userCUD.onAction !== CUDSuccessActions.Create)
    )
      .subscribe((userCUD: CUDSuccessState) => {
        // Close the modal
        this.dialogRef.close();

        let verb: string;

        switch (userCUD.onAction) {

          case CUDSuccessActions.Update:
            verb = 'Updated';
          break;

          case CUDSuccessActions.Delete:
            verb = 'Deleted';
            break;
        }

        // Show a snack bar to indicate the operation
        this.snackBar.open(`User ${verb} Successfully`, 'GOT IT!', {
          duration: 2000,
        });
      });

    // Detect when a CUD error occur and display a snackbar
    this.store.pipe(
      select(selectLocalUserCUDFailed),
      // Only when the error is true
      filter((hasError: boolean) => hasError)
    )
      .subscribe(() => {
        this.snackBar.open('Connection Error', 'OK', {
          duration: 10000
        });
      });
  }

  ngOnInit() {
    // Change the default filtering to filter only by email
    this.dataSource.filterPredicate = this.filterByEmail;
  }

  /**
   * Capture each time the user types to filter the table with
   * that criteria
   *
   * @param emailToSearch The email to search for
   */
  emailCriteriaChanged(emailToSearch: string) {
    emailToSearch = emailToSearch.trim(); // Remove whitespace
    emailToSearch = emailToSearch.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource.filter = emailToSearch;
  }

  /**
   * Update the table rows
   */
  updateRows() {
    if (this.table) {
      this.table.renderRows();
    }
  }

  /**
   * Delete a selected user
   * @param user
   */
  deleteUser(user: LocalUser) {
    // Open the confirmation dialog
    this.dialogRef = this.dialog.open(DeleteConfirmationComponent, {
      data: user
    });
  }

  /**
   * Update the user
   * @param user
   */
  editUser(user: LocalUser) {
    this.dialogRef = this.dialog.open(CreateEditUserComponent, {
      width: '50%',
      maxWidth: '500px',
      minWidth: '344px',
      data: new LocalUser(user)
    });
  }

  /**
   * Function to overwrite the custom filtering Material Table
   *
   * @param data localUser to filter
   * @param criteria The string to search for
   */
  private filterByEmail(data: LocalUser, criteria: string): boolean {
    return data.email.search(criteria) !== -1;
  }
}
