import { MockProxy, mock } from 'jest-mock-extended';
import { UserRepository } from '../../../../src/modules/users/repositories/user.repository';
import { faker } from '@faker-js/faker/.';
import { User } from '../../../../src/modules/users/entities/user.entity';
import { ProfileUserService } from '../../../../src/modules/users/services/profile-user.service';

describe('ProfileUserService', () => {
  let useCase: ProfileUserService;
  let repository: MockProxy<UserRepository>;
  let user: User;

  beforeEach(() => {
    repository = mock<UserRepository>();

    user = new User({
      email: faker.internet.email(),
      name: faker.person.fullName(),
      password: faker.internet.password(),
    });

    repository.findById.mockResolvedValue(user);
    repository.save.mockResolvedValue();

    useCase = new ProfileUserService(repository);
  });

  it('should return the user profile', async () => {
    const response = await useCase.execute(user.id);

    expect(response).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        name: user.name,
        email: user.email.value,
      }),
    );
  });

  it('should not return the user profile if the user does not exist', async () => {
    repository.findById.mockResolvedValueOnce(null);

    await expect(useCase.execute('invalid-id')).rejects.toThrow(
      'User not found',
    );
  });
});
