import { Module } from '@nestjs/common';
import { SendMailUseCase } from './services/send-mail.service';
import { NotificationRepositoryImpl } from './infrastructure/repository/notification-impl.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationSchema } from './infrastructure/repository/schemas/notification.schema';
import { FakerMailer } from './providers/implementations/faker-mailer';
@Module({
  imports: [TypeOrmModule.forFeature([NotificationSchema])],
  controllers: [],
  providers: [
    SendMailUseCase,
    {
      provide: 'MailProvider',
      useClass: FakerMailer,
    },
    {
      provide: 'NotificationRepository',
      useClass: NotificationRepositoryImpl,
    },
  ],
  exports: [SendMailUseCase],
})
export class NotificationModule {}
