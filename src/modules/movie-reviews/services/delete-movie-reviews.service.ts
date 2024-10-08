import { Inject, Injectable } from '@nestjs/common';

import { MovieRepository } from '../repositories/movie.repository';

import { UnauthorizedException } from '@/core/errors/unauthorized';
import { MovieNotFound } from '../entity/errors/movie-not-found';

interface Input {
  userId: string;
  reviewId: string;
}

@Injectable()
export class DeleteMovieReviewsService {
  constructor(
    @Inject('MovieRepository')
    private readonly repository: MovieRepository,
  ) {}

  async execute(params: Input): Promise<void> {
    const { reviewId, userId } = params;
    const movieReview = await this.repository.getMovieReview(reviewId);

    if (!movieReview) {
      throw new MovieNotFound();
    }

    if (movieReview.userId !== userId) {
      throw new UnauthorizedException();
    }

    await this.repository.deleteReview(reviewId);
  }
}
