import { AppDataSource } from '@/config/data-source';
import { AuthenticationModule } from '@/modules/auth/auth.module';
import { UserModule } from '@/modules/users/user.module';
import { faker } from '@faker-js/faker/.';
import { INestApplication } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as request from 'supertest';

describe('AuthController', () => {
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
        AuthenticationModule,
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

  it('should authenticated user ', async () => {
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

    const auth = await request(app.getHttpServer())
      .post('/auth')
      .send({
        email: params.email,
        password: params.password,
      })
      .expect(201);

    expect(auth.body).toEqual(
      expect.objectContaining({
        accessToken: expect.any(String),
        user: expect.objectContaining({
          id: expect.any(String),
          name: params.name,
          email: params.email.toLowerCase(),
        }),
      }),
    );
  });

  it('should thorw an error when authenticate user with invalid credentials', async () => {
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

    await request(app.getHttpServer())
      .post('/auth')
      .send({
        email: params.email,
        password: 'invalid-password',
      })
      .expect(400);

    await request(app.getHttpServer())
      .post('/auth')
      .send({
        email: 'invalid-email',
        password: params.password,
      })
      .expect(400);
  });
});
