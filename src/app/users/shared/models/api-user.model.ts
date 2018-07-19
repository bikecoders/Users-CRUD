import { BasicModel } from '../../../shared/basic-model/basic.model';

export interface ApiUserResponse extends Pagination {
  data: ApiUser[];
}

export interface Pagination {
  /**
   * Indicates current page that the user is watching in users api list
   *
   * @type {number}
   * @memberof Pagination
   */
  page: number;
  /**
   * Indicates how many users will be requested and shown in the list
   *
   * @type {number}
   * @memberof Pagination
   */
  per_page: number;
  /**
   * Indicates the total of users in the API
   *
   * @type {number}
   * @memberof Pagination
   */
  total?: number;
  /**
   * Total pages needed to display all users
   *
   * @type {number}
   * @memberof Pagination
   */
  total_pages?: number;
}

/**
 * Model of API user
 */
export interface ApiUser {
  /**
   * The ID of the user
   */
  id: number;

  /**
   * First Name of the user
   */
  first_name: string;

  /**
   * Last Name of the user
   */
  last_name: string;

  /**
   * The picture or avatar of the user
   * Is an URL
   */
  avatar: string;
}

export class ApiUser extends BasicModel<ApiUser> {

  constructor(apiUser: ApiUser) {
    super(apiUser);
  }

  /**
   * Get the full name of the user
   * @returns {string} The full name of the user
   * @example "Diego Juliao"
   */
  get fullName (): string {
    return this.first_name + ' ' + this.last_name;
  }
}
