import { NotFoundException } from '@/core/errors/not-found-exception';
import { HashProvider } from '@/modules/users/providers/hash.provider';
import { UserRepository } from '@/modules/users/repositories/user.repository';
import { Inject, Injectable } from '@nestjs/common';

interface Input {
  token: string;
  password: string;
  confirmPassword: string;
}

@Injectable()
export class ResetPasswordService {
  constructor(
    @Inject('UserRepository')
    private readonly repository: UserRepository,

    @Inject('HashProvider')
    private readonly hashProvider: HashProvider,
  ) {}

  async execute(params: Input) {
    const { confirmPassword, password, token } = params;

    const user = await this.repository.findByToken(token);

    if (!user) {
      throw new NotFoundException('Token invalid');
    }

    if (password !== confirmPassword) {
      throw new NotFoundException('Passwords do not match');
    }

    const hashedPassword = await this.hashProvider.hash(password);

    user.clearForgotPasswordToken();
    user.setPassword(hashedPassword);

    await this.repository.update(user);
  }
}
