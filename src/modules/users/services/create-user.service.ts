import { Inject, Injectable } from '@nestjs/common';

import { User } from '../entities/user.entity';
import { BaseError } from '../../../core/errors/base-error';

import { HashProvider } from '../providers/hash.provider';
import { UserRepository } from '../repositories/user.repository';

@Injectable()
export class CreateUserService {
  constructor(
    @Inject('UserRepository')
    private readonly repository: UserRepository,
    @Inject('HashProvider')
    private readonly hashProvider: HashProvider,
  ) {}

  async execute(name: string, email: string, password: string) {
    const userAlreadyExists = await this.repository.findByEmail(email);

    if (userAlreadyExists) {
      throw new BaseError('User already exists');
    }

    const passwordHash = await this.hashProvider.hash(password);

    const user = new User({
      email,
      name,
      password: passwordHash,
    });

    await this.repository.save(user);

    return { id: user.id };
  }
}
