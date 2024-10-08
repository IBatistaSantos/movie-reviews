import { AppDataSource } from '@/config/data-source';
import { UserModule } from '@/modules/users/user.module';
import { faker } from '@faker-js/faker/.';
import { INestApplication } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as request from 'supertest';

describe('UserController', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        TypeOrmModule.forRootAsync({
          imports: [ConfigModule],
          inject: [ConfigService],
          useFactory: (configService: ConfigService) => ({
            ...AppDataSource(configService).options,
            dropSchema: true,
            synchronize: true,
          }),
        }),
        UserModule,
      ],
      controllers: [],
      providers: [],
    }).compile();

    app = moduleFixture.createNestApplication();

    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('should be defined', () => {
    expect(app).toBeDefined();
  });

  it('should create a user', async () => {
    const params = {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password({
        length: 8,
      }),
    };
    const response = await request(app.getHttpServer())
      .post('/users')
      .send(params)
      .expect(201);

    expect(response.body).toEqual(
      expect.objectContaining({
        id: expect.any(String),
      }),
    );
  });

  it('should throw an error when creating a user with an existing email', async () => {
    const params = {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password({
        length: 8,
      }),
    };
    await request(app.getHttpServer()).post('/users').send(params).expect(201);
    await request(app.getHttpServer()).post('/users').send(params).expect(400);
  });
});
