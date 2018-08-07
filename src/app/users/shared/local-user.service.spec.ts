import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { of, Observable } from 'rxjs';

import { StoreModule, Store } from '@ngrx/store';
import { AppState } from '../../store';
import { localUserReducer } from '../../store/local-users/reducers';

import { LocalUserService } from './local-user.service';
import { LocalStorage } from '@ngx-pwa/local-storage';
import { ReadLocalUsersSuccess, CUDLocalUserSuccessPayloadModel, CUDSuccessActions } from '../../store/local-users/actions';
import { LocalUser } from './models/local-user.model';

class LocalStorageMockService {
  setItem(key: string, value: any) {
    return of(true);
  }

  getItem<T = any>(key: string): Observable<T | null> {
    return of({} as T);
  }
}

describe('LocalUserService', () => {
  let service: LocalUserService;

  let httpMock: HttpTestingController;
  let localStorageMockService: LocalStorageMockService;
  let store: Store<AppState>;

  let user: LocalUser;
  let usersToDispatch: LocalUser[];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        StoreModule.forRoot({
          localUsers: localUserReducer,
        })
      ],
      providers: [
        LocalUserService,
        {
          provide: LocalStorage, useClass: LocalStorageMockService
        }
      ]
    });

    service = TestBed.get(LocalUserService);
    httpMock = TestBed.get(HttpTestingController);
    localStorageMockService = TestBed.get(LocalStorage);
    store = TestBed.get(Store);
  });

  beforeEach(() => {
    user = {
      id: '636',
      firstName: 'Diego',
      lastName: 'Juliao',
      email: 'dianjuar@gmail.com',
      phone: '123123123123',
      birthDate: '1988-05-09T05:00:00.000Z',
      createdAt: '2018-07-07T21:43:39.030Z',
      updatedAt: '2018-07-07T21:43:39.030Z',
      age: 30
    } as any;

    usersToDispatch = [
      new LocalUser(user)
    ];
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should subscribe to the users selector', () => {
    const action = new ReadLocalUsersSuccess(usersToDispatch);
    store.dispatch(action);

    expect(service.users).toEqual(usersToDispatch);
  });

  it('should delete an user', () => {
    const userToDelete = {id: '123'} as LocalUser;

    service.users = [
      { id: '111' } as LocalUser,
      { id: '123' } as LocalUser,
      { id: '333' } as LocalUser
    ];

    const usersAfterDelete = [
      { id: '111' } as LocalUser,
      { id: '333' } as LocalUser
    ];

    const expectedData: CUDLocalUserSuccessPayloadModel = {
      CUDUser: userToDelete,
      CUDAction: CUDSuccessActions.Delete,
      users: usersAfterDelete
    };

    const setItemSpy = spyOn(localStorageMockService, 'setItem').and.returnValue(of({}));

    service.deleteUser(userToDelete)
      .subscribe((dataReturned: CUDLocalUserSuccessPayloadModel) => {
        expect(dataReturned).toEqual(expectedData);
      });

    const finalUrl = `https://reqres.in/api/users/${userToDelete.id}`;
    const req = httpMock.expectOne(finalUrl);
    req.flush({});

    expect(req.request.method).toBe('DELETE');
    expect(setItemSpy).toHaveBeenCalledWith('users', usersAfterDelete);
  });

  it('should save a new user', () => {
    const newUser = new LocalUser({ id: '123' } as LocalUser);
    service.users = [
      new LocalUser({ id: '111' } as LocalUser),
      new LocalUser({ id: '333' } as LocalUser)
    ];
    const usersAfterSaveNewUser = [
      ...service.users,
      newUser
    ];

    const setCreatedAtSpy = spyOn(newUser, 'setCreatedAt');
    const setUpdatedAtSpy = spyOn(newUser, 'setUpdatedAt');

    const expectedData: CUDLocalUserSuccessPayloadModel = {
      CUDUser: newUser,
      CUDAction: CUDSuccessActions.Create,
      users: usersAfterSaveNewUser
    };

    const setItemSpy = spyOn(localStorageMockService, 'setItem').and.returnValue(of({}));

    service.saveUser(newUser)
      .subscribe((dataReturned: CUDLocalUserSuccessPayloadModel) => {
        expect(dataReturned).toEqual(expectedData);
      });

    const finalUrl = `https://reqres.in/api/users/`;
    const req = httpMock.expectOne(finalUrl);
    const httpResponse = { createdAt: new Date() };
    req.flush(httpResponse);

    expect(req.request.method).toBe('POST');
    expect(setItemSpy).toHaveBeenCalledWith('users', usersAfterSaveNewUser);
    expect(setCreatedAtSpy).toHaveBeenCalledWith(httpResponse.createdAt);
    expect(setUpdatedAtSpy).toHaveBeenCalledWith(httpResponse.createdAt);
  });

  it('should update an user', () => {
    const userToUpdate: LocalUser = new LocalUser({ id: '123', firstName: 'Andre' } as LocalUser);
    service.users = [
      new LocalUser({ id: '111', firstName: 'Yossely' } as LocalUser),
      new LocalUser({ id: '123', firstName: 'Diego' } as LocalUser),
      new LocalUser({ id: '333', firstName: 'Woompy' } as LocalUser)
    ];

    const usersAfterUpdate = [
      new LocalUser({ id: '111', firstName: 'Yossely' } as LocalUser),
      new LocalUser({ id: '123', firstName: 'Andre' } as LocalUser),
      new LocalUser({ id: '333', firstName: 'Woompy' } as LocalUser)
    ];

    const setUpdatedAtSpy = spyOn(LocalUser.prototype, 'setUpdatedAt');

    const expectedData: CUDLocalUserSuccessPayloadModel = {
      CUDUser: userToUpdate,
      CUDAction: CUDSuccessActions.Update,
      users: usersAfterUpdate
    };

    const setItemSpy = spyOn(localStorageMockService, 'setItem').and.returnValue(of({}));

    service.updateUser(userToUpdate)
      .subscribe((dataReturned: CUDLocalUserSuccessPayloadModel) => {
        expect(dataReturned).toEqual(expectedData);
      });

    const finalUrl = `https://reqres.in/api/users/`;
    const req = httpMock.expectOne(finalUrl);
    const httpResponse = { updatedAt: new Date() };
    req.flush(httpResponse);

    expect(req.request.method).toBe('PUT');
    expect(setItemSpy).toHaveBeenCalledWith('users', usersAfterUpdate);
    expect(setUpdatedAtSpy).toHaveBeenCalledWith(httpResponse.updatedAt);
  });

  describe('load local users', () => {
    const mockLocalStorageGetItem = (dataToReturn: LocalUser[] | null) =>
      spyOn(localStorageMockService, 'getItem').and.returnValue(of(dataToReturn));

    it('should fetch users from local storage', () => {
      const usersToReturn = [user];
      mockLocalStorageGetItem(usersToReturn);

      const expectedData: LocalUser[] = [new LocalUser(user)];
      service.loadLocalUsers().subscribe(dataReturned => {
        expect(dataReturned).toEqual(expectedData);
      });
    });

    it('should fetch set local users as an empty array when receives null', () => {
      mockLocalStorageGetItem(null);

      const expectedData: LocalUser[] = [];
      service.loadLocalUsers().subscribe(dataReturned => {
        expect(dataReturned).toEqual(expectedData);
      });
    });
  });

  describe('check if email already exists', () => {
    beforeEach(() => {
      service.users = [
        { email: 'aaa@gmail.com' } as LocalUser,
        { email: 'bbb@gmail.com' } as LocalUser,
        { email: 'ccc@gmail.com' } as LocalUser
      ];
    });

    it('should find an email that is currently assign to an user', () => {
      const emailToVerify = 'bbb@gmail.com';
      expect(service.doesEmailExists(emailToVerify)).toBeTruthy();
    });

    it('should NOT find an email that does not exists', () => {
      const emailToVerify = 'nonexisting@email.com';
      expect(service.doesEmailExists(emailToVerify)).toBeFalsy();
    });
  });
});

