import { MockProxy, mock } from 'jest-mock-extended';
import { faker } from '@faker-js/faker/.';

import { UserRepository } from '@/modules/users/repositories/user.repository';

import { HashProvider } from '@/modules/users/providers/hash.provider';
import { CreateUserService } from '@/modules/users/services/create-user.service';
import { User } from '@/modules/users/entities/user.entity';

describe('CreateUserService', () => {
  let useCase: CreateUserService;
  let repository: MockProxy<UserRepository>;
  let hashProvider: MockProxy<HashProvider>;

  beforeEach(() => {
    repository = mock<UserRepository>();
    hashProvider = mock<HashProvider>();

    repository.findByEmail.mockResolvedValue(null);
    repository.save.mockResolvedValue();

    useCase = new CreateUserService(repository, hashProvider);
  });

  it('should create a new user', async () => {
    const name = faker.person.fullName();
    const email = faker.internet.email();
    const password = faker.internet.password();

    hashProvider.hash.mockResolvedValue('hashed-password');

    const response = await useCase.execute(name, email, password);

    expect(response).toEqual({ id: expect.any(String) });
  });

  it('should not create a new user if the email is already in use', async () => {
    const name = faker.person.fullName();
    const email = faker.internet.email();
    const password = faker.internet.password();

    repository.findByEmail.mockResolvedValue(
      new User({
        email,
        name,
        password,
      }),
    );

    await expect(useCase.execute(name, email, password)).rejects.toThrowError(
      'User already exists',
    );
  });
});
