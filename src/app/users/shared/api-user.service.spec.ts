import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ApiUserService } from './api-user.service';
import { Pagination, ApiUserResponse, ApiUser } from './models/api-user.model';

describe('ApiUserService', () => {
  let service: ApiUserService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ApiUserService]
    });

    service = TestBed.get(ApiUserService);
    httpMock = TestBed.get(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get the users', () => {
    const dummyUsers: ApiUserResponse = {
      page: 2,
      per_page: 3,
      total: 12,
      total_pages: 4,
      data: [
        {
          id: 4,
          first_name: 'Eve',
          last_name: 'Holt',
          avatar: 'https://s3.amazonaws.com/uifaces/faces/twitter/marcoramires/128.jpg'
        } as ApiUser,
        {
          id: 5,
          first_name: 'Charles',
          last_name: 'Morris',
          avatar: 'https://s3.amazonaws.com/uifaces/faces/twitter/stephenmoon/128.jpg'
        } as ApiUser,
        {
          id: 6,
          first_name: 'Tracey',
          last_name: 'Ramos',
          avatar: 'https://s3.amazonaws.com/uifaces/faces/twitter/bigmancho/128.jpg'
        } as ApiUser
      ]
    };
    const dataExpected: ApiUserResponse = JSON.parse(JSON.stringify(dummyUsers));
    dataExpected.data.forEach((user, index, all) => all[index] = new ApiUser(user));

    let dataReturned: ApiUserResponse;

    const pagination: Pagination = {
      page: 2,
      per_page: 3
    };
    service.getUsers(pagination).subscribe((resp) => dataReturned = resp);

    const finalUrl = `https://reqres.in/api/users?page=${pagination.page}&per_page=${pagination.per_page}`;
    const req = httpMock.expectOne(finalUrl);
    req.flush(dummyUsers);

    expect(req.request.method).toBe('GET');
    expect(dataReturned).toEqual(dataExpected);
  });

  it('should retry the request when an error occurs', () => {
    let wasICalled = false;
    let hasErrors = false;
    const retryCount = 3;

    const pagination: Pagination = {
      page: 2,
      per_page: 3
    };
    const finalUrl = `https://reqres.in/api/users?page=${pagination.page}&per_page=${pagination.per_page}`;

    service.getUsers(pagination)
      .subscribe(
        () => {
          wasICalled = true;
        },
        (err) => {
          hasErrors = true;
        });

    for (let index = 0; index < retryCount + 1; index++) {
      const req = httpMock.expectOne(finalUrl);
      req.error(new ErrorEvent('error'));
    }

    expect(wasICalled).toBeFalsy('Should enter in the subscribe next');
    expect(hasErrors).toBeTruthy('should enter on the subscribe error');
  });

  it('should retry the request when the timeout expires', fakeAsync(() => {
    let wasICalled = false;
    let hasErrors = false;
    const retryCount = 3;

    const pagination: Pagination = {
      page: 2,
      per_page: 3
    };
    const finalUrl = `https://reqres.in/api/users?page=${pagination.page}&per_page=${pagination.per_page}`;

    service.getUsers(pagination)
      .subscribe(
        () => {
          wasICalled = true;
        },
        (err) => {
          hasErrors = true;
        });

    for (let index = 0; index < retryCount + 1; index++) {
      const req = httpMock.expectOne(finalUrl);
      tick(3000);
    }

    expect(wasICalled).toBeFalsy('Should enter in the subscribe next');
    expect(hasErrors).toBeTruthy('should enter on the subscribe error');
  }));
});
