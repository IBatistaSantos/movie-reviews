import { faker } from '@faker-js/faker';
import { User } from '../../../../src/modules/users/entities/user.entity';

describe('UserEntity', () => {
  it('should create a new UserEntity', () => {
    const userEntity = new User({
      email: faker.internet.email(),
      name: faker.person.fullName(),
      password: faker.internet.password(),
    });
    expect(userEntity).toBeInstanceOf(User);
    expect(userEntity.id).toBeDefined();
  });

  it('should return the JSON representation of the UserEntity', () => {
    const userEntity = new User({
      email: faker.internet.email(),
      name: faker.person.fullName(),
      password: faker.internet.password(),
    });
    const json = userEntity.toJSON();
    expect(json).toEqual({
      id: userEntity.id,
      createdAt: userEntity.createdAt,
      updatedAt: userEntity.updatedAt,
      status: userEntity.status.value,
      name: userEntity.name,
      forgotPasswordToken: null,
      email: userEntity.email.value,
      password: userEntity.password,
    });
  });
});
