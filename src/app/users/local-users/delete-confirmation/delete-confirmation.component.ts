import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { LocalUser } from '../../shared/models/local-user.model';

import { Observable } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { AppState, selectLocalUsersLoadingCUD } from '../../../store';
import { DeleteLocalUser } from '../../../store/local-users/actions';

@Component({
  selector: 'app-delete-confirmation',
  templateUrl: './delete-confirmation.component.html',
  styleUrls: ['./delete-confirmation.component.scss']
})
export class DeleteConfirmationComponent implements OnInit {

  /**
   * The user to delete
   */
  userToDelete: LocalUser;

  /**
   * To indicate if the component is loading
   *
   * @type {Observable<boolean>}
   * @memberof LocalUsersComponent
   */
  loading: Observable<boolean>;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<DeleteConfirmationComponent>,
    private store: Store<AppState>
  ) {
    // Get the user to be deleted
    this.userToDelete = data as LocalUser;

    this.loading = this.store.pipe(select(selectLocalUsersLoadingCUD));
  }

  ngOnInit() {
  }

  /**
   * Just close the modal because the user doesn't want to do anything
   *
   * @returns {Observable<any>} An observable to subscribe an know when the dialog is closed
   */
  closeModal(): Observable<any> {
    this.dialogRef.close();

    return this.dialogRef.afterClosed();
  }

  /**
   * Dispatch the action to delete the user
   *
   * @memberof DeleteConfirmationComponent
   */
  deleteUser() {
    this.store.dispatch(new DeleteLocalUser(this.userToDelete));
  }
}
