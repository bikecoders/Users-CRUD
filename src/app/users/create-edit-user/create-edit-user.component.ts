import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  FormGroupDirective,
  NgForm,
  Validators
} from '@angular/forms';

import { MatDialogRef } from '@angular/material/dialog';

import { MatSnackBar, MAT_DIALOG_DATA, ErrorStateMatcher } from '@angular/material';

import { LocalUser } from '../shared/models/local-user.model';
import { LocalUserService } from '../shared/local-user.service';

import { Observable } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { AppState, selectLocalUsersLoadingCUD } from '../../store';
import { CreateLocalUser, UpdateLocalUser } from '../../store/local-users/actions';

/** Error when invalid control is dirty, touched, or submitted. */
class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-create-edit-user',
  templateUrl: './create-edit-user.component.html',
  styleUrls: ['./create-edit-user.component.scss'],
})
export class CreateEditUserComponent implements OnInit {

  /**
   * Reference to the form
   */
  @ViewChild('userForm') userForm: NgForm;

  /**
   * Match errors
   */
  matcher: MyErrorStateMatcher;

  /**
   * Group of validations to validate the form
   *
   * @type {FormGroup}
   * @memberof CreateEditUserComponent
   */
  myForm: FormGroup;

  /**
   * Indicate whether the modal is editing or creating a user
   */
  onEdit: boolean;

  /**
   * The start date of the date picker
   * UX improvident, the user will be more near to its birth date
   */
  startDate: Date;

  /**
   * The max date that an user can put
   * UX improvident, has no sense on a birth date put future dates
   */
  maxDate: Date;

  /**
   * Representation of the user
   */
  user: LocalUser;

  /**
   * To indicate if the component is loading
   *
   * @type {Observable<boolean>}
   * @memberof LocalUsersComponent
   */
  loading: Observable<boolean>;

  constructor(
    @Inject(MAT_DIALOG_DATA) public userToEdit: any,
    public dialogRef: MatDialogRef<CreateEditUserComponent>,
    private fb: FormBuilder,
    private localUserService: LocalUserService,
    private snackBar: MatSnackBar,
    private store: Store<AppState>
  ) {
    this.loading = this.store.pipe(select(selectLocalUsersLoadingCUD));

    // Set the start dates
    this.startDate = new Date();
    // Rest 30 years to today
    this.startDate.setFullYear(this.startDate.getFullYear() - 30);

    this.maxDate = new Date();
    // Rest 2 years to today, a two years baby can use this ;)
    this.maxDate.setFullYear(this.maxDate.getFullYear() - 2);

    // If a user to edit is passed, set it as a current user
    if (!this.userToEdit) {
      this.onEdit = false;
      this.user = LocalUser.initEmptyUser();
    } else {
      this.user = this.userToEdit;
      this.onEdit = true;
    }

    this.matcher = new MyErrorStateMatcher();
  }

  ngOnInit() {
    this.myForm = this.fb.group({
      /**
       * Control the emails errors
       */
      email: [
        '',
        [Validators.required, Validators.email, this.validateEmail.bind(this)],
      ],
      /**
       * Control the names errors
       */
      firstName: [
        '',
        [Validators.required, Validators.pattern(/^.*(.*\w){2,}.*$/)]
      ],
      /**
       * Control the names errors
       */
      secondName: [
        '',
        [Validators.required, Validators.pattern(/^.*(.*\w){2,}.*$/)]
      ],
      /**
       * Control the names errors
       */
      phone: [
        '',
        [Validators.required, Validators.pattern(/^\d{9,15}$/)]
      ]
    });
  }

  /**
   * Just close the modal because the user doesn't want to do anything
   *
   * @param dataOnClose the data to pass to the component who opens this modal
   * @returns {Observable<any>} An observable to subscribe an know when the dialog is closed
   */
  closeModal(dataOnClose?: any): Observable<any> {
    this.dialogRef.close(dataOnClose);

    return this.dialogRef.afterClosed();
  }

  /**
   * Catch the event of the form submit and go to save the user
   * after that, show a message
   */
  onSubmit() {
    // If we are editing or creating
    if (this.onEdit) {
      this.updateUser();
    } else {
      this.saveNewUser();
    }
  }

  /**
   * Trigger the submit of the new user form
   */
  submitForm() {
    this.userForm.ngSubmit.next();
  }

  /**
   * Save the new user information
   */
  private saveNewUser() {
    this.store.dispatch(new CreateLocalUser(this.user));
  }

  /**
   * Update the current edited user
   */
  private updateUser() {
    this.store.dispatch( new UpdateLocalUser(this.user));
  }

  /**
   * A function to validate if the email already exits among
   * the existing users
   *
   * @private
   * @param {AbstractControl} control
   * @returns null | { duplicate: true }
   * @memberof CreateEditUserComponent
   */
  private validateEmail(control: AbstractControl) {
    // if we are editing don't make this validation
    if (this.onEdit) {
      return null;
    }

    const hasError = this.localUserService.doesEmailExists(control.value);

    return hasError ? { duplicate: true } : null;
  }
}
