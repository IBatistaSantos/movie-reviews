import { SearchMovieProvider } from '@/modules/movie-reviews/providers/search-movie';
import { MovieRepository } from '@/modules/movie-reviews/repositories/movie.repository';
import { CreateMovieReviewService } from '@/modules/movie-reviews/services/create-movie-reviews.service';
import { Test, TestingModule } from '@nestjs/testing';
import { mock, MockProxy } from 'jest-mock-extended';

describe('CreateMovieReviewService', () => {
  let provider: CreateMovieReviewService;
  let repository: MockProxy<MovieRepository>;
  let searchMovieProvider: MockProxy<SearchMovieProvider>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: CreateMovieReviewService,
          useClass: CreateMovieReviewService,
        },
        {
          provide: 'MovieRepository',
          useValue: (repository = mock<MovieRepository>()),
        },
        {
          provide: 'SearchMovieProvider',
          useValue: (searchMovieProvider = mock<SearchMovieProvider>()),
        },
      ],
    }).compile();

    provider = module.get<CreateMovieReviewService>(CreateMovieReviewService);
  });

  it('should create a movie review', async () => {
    const title = 'The Matrix';
    const userId = '1';
    const notes = 'Great movie!';

    searchMovieProvider.search.mockResolvedValue({
      title,
      actors: 'Keanu Reeves, Laurence Fishburne',
      director: 'Lana Wachowski, Lilly Wachowski',
      genre: 'Action, Sci-Fi',
      poster: 'https://example.com/poster.jpg',
      rating: 8.7,
      released: '31 Mar 1999',
      year: '1999',
    });

    repository.findByTitle.mockResolvedValue(null);
    repository.createReview.mockResolvedValue({
      id: '1',
      movieId: '1',
      userId,
      notes,
    });

    await provider.execute({ userId, title, notes });

    expect(searchMovieProvider.search).toHaveBeenCalledWith(title);
    expect(repository.findByTitle).toHaveBeenCalledWith(title);
    expect(repository.createReview).toHaveBeenCalledWith({
      movieId: expect.any(String),
      userId,
      notes,
    });
  });

  it('should not create a movie review when movie is not found', async () => {
    const title = 'The Matrix';
    const userId = '1';
    const notes = 'Great movie!';

    searchMovieProvider.search.mockResolvedValue(null);

    await expect(provider.execute({ userId, title, notes })).rejects.toThrow(
      'Movie not found',
    );
  });

  it('should create a movie when movie is not found', async () => {
    const title = 'The Matrix';
    const userId = '1';
    const notes = 'Great movie!';

    searchMovieProvider.search.mockResolvedValue({
      title,
      actors: 'Keanu Reeves, Laurence Fishburne',
      director: 'Lana Wachowski, Lilly Wachowski',
      genre: 'Action, Sci-Fi',
      poster: 'https://example.com/poster.jpg',
      rating: 8.7,
      released: '31 Mar 1999',
      year: '1999',
    });

    repository.findByTitle.mockResolvedValue(null);
    repository.createReview.mockResolvedValue({
      id: '1',
      movieId: '1',
      userId,
      notes,
    });

    await provider.execute({ userId, title, notes });

    expect(searchMovieProvider.search).toHaveBeenCalledWith(title);
    expect(repository.findByTitle).toHaveBeenCalledWith(title);
    expect(repository.save).toHaveBeenCalledWith(
      expect.objectContaining({
        title,
        actors: 'Keanu Reeves, Laurence Fishburne',
        genre: 'Action, Sci-Fi',
        poster: 'https://example.com/poster.jpg',
        rating: 8.7,
        released: '31 Mar 1999',
        year: '1999',
      }),
    );
    expect(repository.createReview).toHaveBeenCalledWith({
      movieId: expect.any(String),
      userId,
      notes,
    });
  });
});
