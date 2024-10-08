import { MovieRepository } from '@/modules/movie-reviews/repositories/movie.repository';
import { DeleteMovieReviewsService } from '@/modules/movie-reviews/services/delete-movie-reviews.service';
import { faker } from '@faker-js/faker/.';
import { Test, TestingModule } from '@nestjs/testing';
import { mock, MockProxy } from 'jest-mock-extended';

describe('DeleteMovieReviewsService', () => {
  let provider: DeleteMovieReviewsService;
  let repository: MockProxy<MovieRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: DeleteMovieReviewsService,
          useClass: DeleteMovieReviewsService,
        },
        {
          provide: 'MovieRepository',
          useValue: (repository = mock<MovieRepository>()),
        },
      ],
    }).compile();

    provider = module.get<DeleteMovieReviewsService>(DeleteMovieReviewsService);
  });

  it('should delete a movie review', async () => {
    const reviewId = faker.string.uuid();
    const userId = faker.string.uuid();

    repository.getMovieReview.mockResolvedValue({
      userId,
      notes: 'Great movie!',
      movieId: faker.string.uuid(),
    });

    repository.deleteReview.mockResolvedValue(null);

    await provider.execute({ reviewId, userId });

    expect(repository.getMovieReview).toHaveBeenCalledWith(reviewId);
    expect(repository.deleteReview).toHaveBeenCalledWith(reviewId);
  });

  it('should throw an error if the review does not exist', async () => {
    const reviewId = faker.string.uuid();
    const userId = faker.string.uuid();

    repository.getMovieReview.mockResolvedValue(null);

    await expect(provider.execute({ reviewId, userId })).rejects.toThrow(
      'Movie not found',
    );
  });

  it('should throw an error if the user is not the owner of the review', async () => {
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
});
