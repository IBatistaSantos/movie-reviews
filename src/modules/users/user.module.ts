import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserSchema } from './infrastructure/repository/schemas/user.schema';
import { CreateUserService } from './services/create-user.service';
import { BcryptProvider } from './infrastructure/providers/bcrypt.provider';
import { UserController } from './controllers/user.controller';
import { UserRepositoryImpl } from './infrastructure/repository/user-typeorm.repository';
import { ProfileUserService } from './services/profile-user.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserSchema])],
  providers: [
    CreateUserService,
    ProfileUserService,
    {
      provide: 'UserRepository',
      useClass: UserRepositoryImpl,
    },
    {
      provide: 'HashProvider',
      useClass: BcryptProvider,
    },
  ],
  controllers: [UserController],
  exports: ['UserRepository'],
})
export class UserModule {}
