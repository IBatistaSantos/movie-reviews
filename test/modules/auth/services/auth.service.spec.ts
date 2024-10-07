import { mock, MockProxy } from 'jest-mock-extended';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthenticationService } from '../../../../src/modules/auth/services/auth.service';
import { JWTProvider } from '../../../../src/modules/shared/jwt/jwt.provider';
import { HashProvider } from '../../../../src/modules/users/providers/hash.provider';
import { UserRepository } from '../../../../src/modules/users/repositories/user.repository';
import { User } from '../../../../src/modules/users/entities/user.entity';
import { faker } from '@faker-js/faker/.';

describe('AuthenticationService', () => {
  let provider: AuthenticationService;
  let repository: MockProxy<UserRepository>;
  let jwtProvider: MockProxy<JWTProvider>;
  let hashProvider: MockProxy<HashProvider>;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: AuthenticationService,
          useClass: AuthenticationService,
        },
        {
          provide: 'UserRepository',
          useValue: (repository = mock<UserRepository>()),
        },
        {
          provide: 'JWTProvider',
          useValue: (jwtProvider = mock<JWTProvider>()),
        },
        {
          provide: 'HashProvider',
          useValue: (hashProvider = mock<HashProvider>()),
        },
      ],
    }).compile();

    repository.findByEmail.mockResolvedValue(
      new User({
        email: faker.internet.email(),
        name: faker.person.fullName(),
        password: faker.internet.password(),
        id: faker.string.uuid(),
        status: 'ACTIVE',
      }),
    );

    repository.findById.mockResolvedValue(
      new User({
        email: faker.internet.email(),
        name: faker.person.fullName(),
        password: faker.internet.password(),
        id: faker.string.uuid(),
        status: 'ACTIVE',
      }),
    );

    hashProvider.compare.mockResolvedValue(true);
    jwtProvider.generateToken.mockReturnValue(faker.string.uuid());

    provider = module.get<AuthenticationService>(AuthenticationService);
  });

  it('should authenticate user', async () => {
    const response = await provider.execute({
      email: faker.internet.email(),
      password: faker.internet.password(),
    });

    expect(response).toHaveProperty('accessToken');
    expect(response).toHaveProperty('user');
  });

  it('should validate user', async () => {
    const response = await provider.validateUser({
      userId: faker.string.uuid(),
    });

    expect(response).toHaveProperty('email');
    expect(response).toHaveProperty('name');
    expect(response).toHaveProperty('id');
    expect(response).toHaveProperty('status');
  });

  it('should throw bad exception', async () => {
    repository.findByEmail.mockResolvedValue(null);

    await expect(
      provider.execute({
        email: faker.internet.email(),
        password: faker.internet.password(),
      }),
    ).rejects.toThrow('Credentials invalid');
  });

  it('should throw bad exception when password not math', async () => {
    hashProvider.compare.mockResolvedValue(false);

    await expect(
      provider.execute({
        email: faker.internet.email(),
        password: faker.internet.password(),
      }),
    ).rejects.toThrow('Credentials invalid');
  });
});
