import { Module } from '@nestjs/common';
import { UserModule } from './modules/users/user.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthenticationModule } from './modules/auth/auth.module';
import { NotificationModule } from './modules/notification/notification.module';
import { AppDataSource } from './config/data-source';
import { MovieReviewModule } from './modules/movie-reviews/movie-review.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        ...AppDataSource(configService).options,
      }),
    }),
    UserModule,
    AuthenticationModule,
    NotificationModule,
    MovieReviewModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
