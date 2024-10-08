import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthenticationService } from './services/auth.service';
import { BcryptProvider } from '../users/infrastructure/providers/bcrypt.provider';
import { UserRepositoryImpl } from '../users/infrastructure/repository/user-typeorm.repository';
import { JWTProviderImpl } from '../shared/jwt/jwt-impl.provider';
import { JwtStrategy } from './services/jwt.strategy';
import { AuthController } from './controllers/auth.controller';
import { UserSchema } from '../users/infrastructure/repository/schemas/user.schema';
import { ConfigService } from '@nestjs/config';
import { ForgotPasswordService } from './services/forgot-password.service';
import { NotificationModule } from '../notification/notification.module';

@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: { expiresIn: '1d' },
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([UserSchema]),
    NotificationModule,
  ],
  providers: [
    AuthenticationService,
    ForgotPasswordService,
    { provide: 'HashProvider', useClass: BcryptProvider },
    { provide: 'UserRepository', useClass: UserRepositoryImpl },
    { provide: 'JWTProvider', useClass: JWTProviderImpl },
    JwtStrategy,
  ],
  controllers: [AuthController],
  exports: [],
})
export class AuthenticationModule {}
