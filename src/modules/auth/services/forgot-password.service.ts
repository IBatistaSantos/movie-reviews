import { Inject, Injectable } from '@nestjs/common';

import { HashProvider } from '@/modules/users/providers/hash.provider';
import { UserRepository } from '@/modules/users/repositories/user.repository';
import { SendMailUseCase } from '@/modules/notification/services/send-mail.service';
import { NotFoundException } from '@/core/errors/not-found-exception';

interface Input {
  email: string;
}

@Injectable()
export class ForgotPasswordService {
  constructor(
    @Inject('UserRepository')
    private readonly repository: UserRepository,

    private readonly emailService: SendMailUseCase,

    @Inject('HashProvider')
    private readonly hashProvider: HashProvider,
  ) {}

  async execute(params: Input) {
    const user = await this.repository.findByEmail(params.email);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const token = await this.hashProvider.hash(Math.random().toString());

    user.setForgotPasswordToken(token);

    await this.repository.update(user);

    await this.emailService.execute({
      to: {
        email: user.email.value,
        name: user.name,
      },
      context: 'FORGOT_PASSWORD',
      variables: {
        name: user.name,
        link: `${process.env.URL_FRONTEND}/${token}`,
      },
    });
  }
}
