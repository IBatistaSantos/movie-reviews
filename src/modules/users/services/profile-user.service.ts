import { Inject, Injectable } from '@nestjs/common';
import { UserRepository } from '../repositories/user.repository';
import { UserProps } from '../entities/user.entity';
import { UserNotFoundError } from '../entities/erros/user-not-found.error';

interface Output extends Omit<UserProps, 'password'> {}

@Injectable()
export class ProfileUserService {
  constructor(
    @Inject('UsersRepository')
    private readonly repository: UserRepository,
  ) {}

  async execute(userId: string): Promise<Output> {
    const user = await this.repository.findById(userId);
    if (!user) throw new UserNotFoundError();

    const userToJSON = user.toJSON();
    delete userToJSON.password;
    return userToJSON;
  }
}
