import { Component, OnInit, ViewChild } from '@angular/core';

import { CreateEditUserComponent } from './create-edit-user/create-edit-user.component';
import { LocalUser } from './shared/models/local-user.model';

import { filter } from 'rxjs/operators';

import { MatDialog, MatDialogRef, MatTabGroup, MatSnackBar } from '@angular/material';

import { AppState, selectLocalUserCUDSuccess } from '../store';
import { Store, select } from '@ngrx/store';
import { CUDSuccessState } from '../store/local-users/reducers';
import { CUDSuccessActions } from '../store/local-users/actions';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

  @ViewChild('tab') private tab: MatTabGroup;

  /**
   * A reference of the current dialog present
   *
   * @private
   * @type {MatDialogRef<CreateEditUserComponent>}
   * @memberof UsersComponent
   */
  private dialogRef: MatDialogRef<CreateEditUserComponent>;

  constructor(
    public dialog: MatDialog,
    private store: Store<AppState>,
    private snackBar: MatSnackBar,
  ) {
    // Subscribe to user created to close the modal and launch a toast to give feedback
    this.store.pipe(
      select(selectLocalUserCUDSuccess),
      // Ignore undefined values
      filter(userCUD => !!userCUD && userCUD.onAction === CUDSuccessActions.Create),
    )
      .subscribe((userCUD: CUDSuccessState) => {
        // Close the modal
        this.dialogRef.close();

        // Show a snack bar to indicate the operation
        this.snackBar.open('User Created Successfully', 'GOT IT!', {
          duration: 2000,
        });

        this.tab.selectedIndex = 1;
      });
  }

  ngOnInit() {
  }

  openDialogCreateLocalUser() {
    this.dialogRef = this.dialog.open(CreateEditUserComponent, {
      width: '50%',
      maxWidth: '500px',
      minWidth: '344px'
    });
  }

}
