import { AppDataSource } from '@/config/data-source';
import { AuthenticationModule } from '@/modules/auth/auth.module';
import { MovieReviewModule } from '@/modules/movie-reviews/movie-review.module';
import { UserModule } from '@/modules/users/user.module';
import { faker } from '@faker-js/faker/.';
import { INestApplication } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as request from 'supertest';

describe('MovieController', () => {
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
        MovieReviewModule,
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

  it('should create movie review  ', async () => {
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

    const token = auth.body.accessToken;

    const movieParams = {
      title: 'o poco',
      notes: 'Great Movie!',
    };

    const movieReview = await request(app.getHttpServer())
      .post('/movie-reviews')
      .set('Authorization', `Bearer ${token}`)
      .send(movieParams)
      .expect(201);

    expect(movieReview.body).toEqual(
      expect.objectContaining({
        reviewId: expect.any(String),
        movie: expect.objectContaining({
          title: 'O Poço',
          poster: expect.any(String),
        }),
      }),
    );
  });

  it('should update movie review', async () => {
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

    const token = auth.body.accessToken;

    const movieParams = {
      title: 'o poco',
      notes: 'Great Movie!',
    };

    const movieReview = await request(app.getHttpServer())
      .post('/movie-reviews')
      .set('Authorization', `Bearer ${token}`)
      .send(movieParams)
      .expect(201);

    await request(app.getHttpServer())
      .put(`/movie-reviews/${movieReview.body.reviewId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        notes: 'Great movie! I love it!',
      })
      .expect(200);

    const movieReviewUpdated = await request(app.getHttpServer())
      .get(`/movie-reviews/${movieReview.body.reviewId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(movieReviewUpdated.body).toEqual(
      expect.objectContaining({
        notes: 'Great movie! I love it!',
      }),
    );
  });
});
