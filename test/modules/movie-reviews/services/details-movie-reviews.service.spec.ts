import { Movie } from '@/modules/movie-reviews/entity/movie';
import { MovieRepository } from '@/modules/movie-reviews/repositories/movie.repository';
import { DetailMovieReviewService } from '@/modules/movie-reviews/services/details-movie-review.service';
import { faker } from '@faker-js/faker/.';
import { Test, TestingModule } from '@nestjs/testing';
import { mock, MockProxy } from 'jest-mock-extended';

describe('DetailMovieReviewService', () => {
  let provider: DetailMovieReviewService;
  let repository: MockProxy<MovieRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: DetailMovieReviewService,
          useClass: DetailMovieReviewService,
        },
        {
          provide: 'MovieRepository',
          useValue: (repository = mock<MovieRepository>()),
        },
      ],
    }).compile();

    provider = module.get<DetailMovieReviewService>(DetailMovieReviewService);
  });

  it('should get a movie review', async () => {
    const reviewId = faker.string.uuid();
    const userId = faker.string.uuid();

    repository.getMovieReview.mockResolvedValue({
      userId,
      notes: 'Great movie!',
      movieId: faker.string.uuid(),
    });

    repository.findById.mockResolvedValue(
      new Movie({
        id: faker.string.uuid(),
        title: 'The Matrix',
        director: 'The Matrix',
        actors: 'Keanu Reeves, Laurence Fishburne',
        genre: 'Action, Sci-Fi',
        poster: 'https://example.com/poster.jpg',
        rating: 8.7,
        released: '31 Mar 1999',
        year: '1999',
      }),
    );

    const response = await provider.execute({ reviewId, userId });

    expect(response).toEqual(
      expect.objectContaining({
        notes: 'Great movie!',
        movie: {
          id: expect.any(String),
          title: 'The Matrix',
          actors: 'Keanu Reeves, Laurence Fishburne',
          genre: 'Action, Sci-Fi',
          poster: 'https://example.com/poster.jpg',
          rating: 8.7,
          released: '31 Mar 1999',
          year: '1999',
        },
      }),
    );
  });

  it('should not get a movie review when review is not found', async () => {
    const reviewId = faker.string.uuid();
    const userId = faker.string.uuid();

    repository.getMovieReview.mockResolvedValue(null);

    await expect(provider.execute({ reviewId, userId })).rejects.toThrow(
      'Movie review not found',
    );
  });

  it('should not get a movie review when user is not the owner', async () => {
    const reviewId = faker.string.uuid();
    const userId = faker.string.uuid();

    repository.getMovieReview.mockResolvedValue({
      userId: faker.string.uuid(),
      notes: 'Great movie!',
      movieId: faker.string.uuid(),
    });

    await expect(provider.execute({ reviewId, userId })).rejects.toThrow(
      'Unauthorized',
    );
  });

  it('should not get a movie review when movie is not found', async () => {
    const reviewId = faker.string.uuid();
    const userId = faker.string.uuid();

    repository.getMovieReview.mockResolvedValue({
      userId,
      notes: 'Great movie!',
      movieId: faker.string.uuid(),
    });

    repository.findById.mockResolvedValue(null);

    await expect(provider.execute({ reviewId, userId })).rejects.toThrow(
      'Movie not found',
    );
  });
});
