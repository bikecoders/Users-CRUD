import { Injectable } from '@angular/core';
import { ApiUser, ApiUserResponse, Pagination } from './models/api-user.model';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { map, tap, retry, timeout } from 'rxjs/operators';

@Injectable()
export class ApiUserService {

  /**
   * The endpoint to get the users
   */
  private readonly usersEndpoint = 'https://reqres.in/api/users';

  constructor(private http: HttpClient) { }

  /**
   * Fetch the users from the API
   *
   * @param page Page to fetch
   * @returns {Observable<Array<ApiUser>>} To subscribe and know it loads
   */
  getUsers(pagination: Pagination): Observable<ApiUserResponse> {
    const url = `${this.usersEndpoint}?page=${pagination.page}&per_page=${pagination.per_page}`;

    return this.http.get(url).pipe(
      // give it 3seconds to make the operation
      timeout(3000),
      // Retry the operation 3 times on error
      retry(3),
      // Transform JSON response into the model ApiUserResponse
      map((resp: any) => <ApiUserResponse>resp),
      // Instantiate users
      tap((apiUserResponse: ApiUserResponse) => {
        apiUserResponse.data.forEach(user => new ApiUser(user));
      })
    );
  }
}
