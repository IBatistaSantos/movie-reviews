import { InjectRepository } from '@nestjs/typeorm';
import { TemplateContextValue, Template } from '../../entity/template';
import {
  NotificationRepository,
  SaveSenderEmailParams,
} from '../../repository/notification.repository';
import { NotificationSchema } from './schemas/notification.schema';
import { Repository } from 'typeorm';
import { TypeOrmMapper } from '@/modules/users/infrastructure/repository/typeorm.mapper';

export class NotificationRepositoryImpl implements NotificationRepository {
  constructor(
    @InjectRepository(NotificationSchema)
    private readonly repository: Repository<NotificationSchema>,
  ) {}

  async findByContext(context: TemplateContextValue): Promise<Template> {
    const response = await this.repository.findOne({
      where: { context, status: 'ACTIVE' },
    });

    return TypeOrmMapper.toEntity<Template>(response, Template);
  }

  async save(params: SaveSenderEmailParams): Promise<void> {
    await this.repository.save({
      ...params,
    });
  }
}
