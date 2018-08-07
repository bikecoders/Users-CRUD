import { ApiUser } from './api-user.model';

describe('ApiUser', () => {
  let user: ApiUser;

  beforeEach(() => {
    user = new ApiUser({
      id: 123,
      first_name: 'Yossely',
      last_name: 'Mendoza',
      avatar: 'avatar url'
    } as ApiUser);
  });

  it('should create an instance', () => {
    expect(user).toBeTruthy();
  });

  it('should return the user full name', () => {
    expect(user.fullName).toEqual('Yossely Mendoza');
  });
});

