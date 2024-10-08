import { AppModule } from '@/app.module';
import { Test, TestingModule } from '@nestjs/testing';

let app: TestingModule;

beforeAll(async () => {
  app = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  const appInstance = app.createNestApplication();
  await appInstance.init();
});

afterAll(async () => {
  if (app) {
    await app.close();
  }
});
