import { ConfigService } from '@nestjs/config';

import { DataSource } from 'typeorm';

export const AppDataSource = (configService: ConfigService) => {
  return new DataSource({
    type: 'mysql',
    host: configService.get('DB_HOST'),
    port: configService.get('DB_PORT'),
    username: configService.get('DB_USER'),
    password: configService.get('DB_PASS'),
    database: configService.get('DB_NAME'),
    entities: [__dirname + '/../**/*.schema{.ts,.js}'],
    synchronize: true,
  });
};
