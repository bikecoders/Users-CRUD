import { LocalUser } from './local-user.model';

describe('LocalUser', () => {
  let user: LocalUser;

  beforeEach(() => {
    user = new LocalUser({
      id: '123',
      firstName: 'Diego',
      lastName: 'Juliao',
      email: 'dianjuar@gmail.com',
      phone: '123123123',
      birthDate: new Date('08/08/1991'),
      createdAt: new Date()
    } as LocalUser);

  });

  it('should create an instance', () => {
    expect(user).toBeTruthy();
    expect(user.age).toBeDefined();
  });

  it('should return the user full name', () => {
    expect(user.getFullName()).toEqual('Diego Juliao');
  });

  it('should set the updated at date', () => {
    // set updated date with a string
    const newUpdatedAtString = '07/05/2018';
    user.setUpdatedAt(newUpdatedAtString);

    expect(user.updatedAt).toEqual(new Date(newUpdatedAtString));

    // set updated date with a Date
    const newUpdatedAtDate = new Date('06/07/2018');
    user.setUpdatedAt(newUpdatedAtDate);

    expect(user.updatedAt).toEqual(newUpdatedAtDate);
  });

  it('should set the created at date', () => {
    // set created date with a string
    const newCreatedAtString = '01/03/2018';
    user.setCreatedAt(newCreatedAtString);

    expect(user.createdAt).toEqual(new Date(newCreatedAtString));

    // set created date with a Date
    const newCreatedAtDate = new Date('04/21/2018');
    user.setCreatedAt(newCreatedAtDate);

    expect(user.createdAt).toEqual(newCreatedAtDate);
  });

  it('should create an empty local user', () => {
    const expectedData = new LocalUser({} as any);
    expect(LocalUser.initEmptyUser()).toEqual(expectedData);
  });
});

