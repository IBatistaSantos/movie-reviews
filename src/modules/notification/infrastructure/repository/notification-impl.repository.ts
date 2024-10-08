import { InjectRepository } from '@nestjs/typeorm';
import { TemplateContextValue, Template } from '../../entity/template';
import {
  NotificationRepository,
  SaveSenderEmailParams,
} from '../../repository/notification.repository';
import { TemplateSchema } from './schemas/template.schema';
import { Repository } from 'typeorm';
import { TypeOrmMapper } from '@/modules/users/infrastructure/repository/typeorm.mapper';
import { NotificationSchema } from './schemas/notification.schema';

export class NotificationRepositoryImpl implements NotificationRepository {
  constructor(
    @InjectRepository(TemplateSchema)
    private readonly repository: Repository<TemplateSchema>,
    @InjectRepository(NotificationSchema)
    private readonly notificationRepository: Repository<NotificationSchema>,
  ) {}

  async findByContext(context: TemplateContextValue): Promise<Template> {
    const response = await this.repository.findOne({
      where: { context, status: 'ACTIVE' },
    });

    return TypeOrmMapper.toEntity<Template>(response, Template);
  }

  async save(params: SaveSenderEmailParams): Promise<void> {
    await this.notificationRepository.save({
      ...params,
    });
  }
}
