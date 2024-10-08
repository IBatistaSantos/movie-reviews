import { AppDataSource } from '@/config/data-source';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { CreateForgotPasswordTemplateSeed } from './template-forgot-password';
import { SeedModule } from './seed.module';

async function runSeeds() {
  const app = await NestFactory.createApplicationContext(SeedModule);

  const configService = app.get(ConfigService);

  const dataSource = AppDataSource(configService);

  try {
    await dataSource.initialize();
    console.log('DataSource initialized.');

    const forgotPasswordSeed = new CreateForgotPasswordTemplateSeed();
    await forgotPasswordSeed.run(dataSource);

    console.log('Seeds executed successfully!');
  } catch (error) {
    console.error('Error running seeds:', error);
  } finally {
    await dataSource.destroy();
    await app.close();
  }
}

runSeeds().catch((error) => console.log(error));
