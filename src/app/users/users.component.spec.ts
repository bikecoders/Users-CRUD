import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Component, DebugElement } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';

import {
  MatButtonModule,
  MatDialog,
  MatIconModule,
  MatTabsModule,
  MatSnackBarModule,
  MatSnackBar,
} from '@angular/material';

import { UsersComponent } from './users.component';
import { StoreModule, Store } from '@ngrx/store';
import { localUserReducer } from '../store/local-users/reducers';
import { AppState } from '../store';
import { CUDLocalUserSuccess, CUDLocalUserSuccessPayloadModel, CUDSuccessActions } from '../store/local-users/actions';
import { LocalUser } from './shared/models/local-user.model';

@Component({
  selector: 'app-api-users',
  template: ''
})
export class ApiUsersMockComponent { }

@Component({
  selector: 'app-local-users',
  template: ''
})
export class LocalUsersMockComponent { }

class MatDialogMock {
  open(component: string, options: any) {
    return {
      close: () => {}
    };
  }
}

describe('UsersComponent', () => {
  let component: UsersComponent;
  let componentDe: DebugElement;
  let fixture: ComponentFixture<UsersComponent>;

  let dialogMock: MatDialog;
  let store: Store<AppState>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        UsersComponent,
        ApiUsersMockComponent,
        LocalUsersMockComponent
      ],
      imports: [
        BrowserAnimationsModule,
        MatButtonModule,
        MatIconModule,
        MatSnackBarModule,
        MatTabsModule,
        StoreModule.forRoot({
          localUsers: localUserReducer,
        }),
      ],
      providers: [
        { provide: MatDialog, useClass: MatDialogMock }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsersComponent);
    component = fixture.componentInstance;
    componentDe = fixture.debugElement;

    dialogMock = TestBed.get(MatDialog);
    store = TestBed.get(Store);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should open the dialog to create new user', () => {
    const addNewPersonDe = componentDe.query(By.css('.add-new-person-button'));
    const openDialogSpy = spyOn(dialogMock, 'open').and.callThrough();

    // The dialogRef is undefined if the user has not click the add new person button
    expect((component as any).dialogRef).toBeUndefined();

    // Click on the button to add a new person
    addNewPersonDe.nativeElement.click();

    expect(openDialogSpy).toHaveBeenCalled();

    // The dialogRef must be defined after opening the modal to create a new user
    expect((component as any).dialogRef).toBeDefined();
  });

  it('should perform the actions needed on new user creation success', () => {
    // Open dialog to have its reference in the component and spy its close method
    component.openDialogCreateLocalUser();
    const dialogRefCloseSpy = spyOn((component as any).dialogRef, 'close');

    const snackBar = TestBed.get(MatSnackBar);
    const snackBarOpenSpy = spyOn(snackBar, 'open');

    const newState: CUDLocalUserSuccessPayloadModel = {
      CUDUser: {} as LocalUser,
      users: [{} as LocalUser],
      CUDAction: CUDSuccessActions.Create
    };

    const action = new CUDLocalUserSuccess(newState);
    store.dispatch(action);

    // should close the creation modal
    expect(dialogRefCloseSpy).toHaveBeenCalled();
    // should open snackbar with success message
    expect(snackBarOpenSpy).toHaveBeenCalled();

    // should move to the tab 1
    fixture.detectChanges();
    expect((component as any).tab.selectedIndex).toBe(1);
  });
});

