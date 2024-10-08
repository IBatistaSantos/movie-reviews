import { MovieRepository } from '@/modules/movie-reviews/repositories/movie.repository';
import { UpdateMovieReviewService } from '@/modules/movie-reviews/services/update-movie-review.service';
import { faker } from '@faker-js/faker/.';
import { Test, TestingModule } from '@nestjs/testing';
import { mock, MockProxy } from 'jest-mock-extended';

describe('UpdateMovieReviewService', () => {
  let provider: UpdateMovieReviewService;
  let repository: MockProxy<MovieRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: UpdateMovieReviewService,
          useClass: UpdateMovieReviewService,
        },
        {
          provide: 'MovieRepository',
          useValue: (repository = mock<MovieRepository>()),
        },
      ],
    }).compile();

    provider = module.get<UpdateMovieReviewService>(UpdateMovieReviewService);
  });

  it('should update a movie review', async () => {
    const reviewId = faker.string.uuid();
    const userId = faker.string.uuid();
    const notes = 'Great movie!';

    repository.getMovieReview.mockResolvedValue({
      userId,
      notes: 'Great movie!',
      movieId: faker.string.uuid(),
    });

    repository.updateReview.mockResolvedValue(null);

    await provider.execute({ reviewId, userId, notes });

    expect(repository.getMovieReview).toHaveBeenCalledWith(reviewId);
    expect(repository.updateReview).toHaveBeenCalledWith(reviewId, notes);
  });

  it('should throw an error if the review does not exist', async () => {
    const reviewId = faker.string.uuid();
    const userId = faker.string.uuid();
    const notes = 'Great movie!';

    repository.getMovieReview.mockResolvedValue(null);

    await expect(provider.execute({ reviewId, userId, notes })).rejects.toThrow(
      'Movie review not found',
    );
  });

  it('should throw an error if the user is not the owner of the review', async () => {
    const reviewId = faker.string.uuid();
    const userId = faker.string.uuid();
    const notes = 'Great movie!';

    repository.getMovieReview.mockResolvedValue({
      userId: faker.string.uuid(),
      notes: 'Great movie!',
      movieId: faker.string.uuid(),
    });

    await expect(provider.execute({ reviewId, userId, notes })).rejects.toThrow(
      'Unauthorized',
    );
  });
});
