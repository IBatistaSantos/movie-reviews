import { Injectable } from '@nestjs/common';
import { JWTProvider } from './jwt.provider';
import { JwtService } from '@nestjs/jwt';
import { TokenExpiredException } from '../../../core/errors/token-expired-exception';

@Injectable()
export class JWTProviderImpl implements JWTProvider {
  constructor(private readonly jwtService: JwtService) {}

  verifyToken<T>(token: string): T {
    try {
      return this.jwtService.verify(token) as T;
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw new TokenExpiredException('Token expired');
      }
    }
  }

  generateToken(payload: any): string {
    return this.jwtService.sign(payload);
  }
}
