import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { MovieRepository } from '../repositories/movie.repository';
import { MovieNotFound } from '../entity/errors/movie-not-found';
import { MovieReviewNotFound } from '../entity/errors/movie-review-not-found';

interface Input {
  reviewId: string;
  userId: string;
}

@Injectable()
export class DetailMovieReviewService {
  constructor(
    @Inject('MovieRepository')
    private readonly repository: MovieRepository,
  ) {}

  async execute(params: Input) {
    const { reviewId, userId } = params;

    const response = await this.repository.getMovieReview(reviewId);
    if (!response) throw new MovieReviewNotFound();
    if (response.userId !== userId) throw new UnauthorizedException();

    const movie = await this.repository.findById(response.movieId);
    if (!movie) throw new MovieNotFound();

    return {
      notes: response.notes,
      movie: {
        id: movie.id,
        title: movie.title,
        actors: movie.actors,
        genre: movie.genre,
        poster: movie.poster,
        rating: movie.rating,
        released: movie.released,
        year: movie.year,
      },
    };
  }
}
