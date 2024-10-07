import { JWTProvider } from '../../shared/jwt/jwt.provider';
import { Inject, Injectable } from '@nestjs/common';
import { UserRepository } from '../../users/repositories/user.repository';
import { HashProvider } from '../../users/providers/hash.provider';
import { BadException } from '../../../core/errors/bad-exception';

interface Input {
  email: string;
  password: string;
}

@Injectable()
export class AuthenticationService {
  constructor(
    @Inject('HashProvider')
    private readonly encryption: HashProvider,
    @Inject('UserRepository')
    private readonly userRepository: UserRepository,

    @Inject('JWTProvider')
    private jwtService: JWTProvider,
  ) {}

  async execute({ email, password }: Input) {
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new BadException(`Credentials invalid`);
    }

    const isMatch = await this.encryption.compare(password, user.password);
    if (!isMatch) {
      throw new BadException(`Credentials invalid`);
    }

    const accessToken = this.jwtService.generateToken({
      userId: user.id,
    });

    const userData = user.toJSON();
    delete userData.password;
    return {
      accessToken,
      user: userData,
    };
  }

  async validateUser(payload: any) {
    const user = await this.userRepository.findById(payload.userId);
    return user ? user.toJSON() : null;
  }
}
