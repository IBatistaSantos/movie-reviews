import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { MovieRepository } from '../repositories/movie.repository';
import { MovieReviewNotFound } from '../entity/errors/movie-review-not-found';

interface Input {
  reviewId: string;
  userId: string;
  notes: string;
}

@Injectable()
export class UpdateMovieReviewService {
  constructor(
    @Inject('MovieRepository')
    private readonly repository: MovieRepository,
  ) {}

  async execute(params: Input) {
    const { reviewId, userId, notes } = params;

    const response = await this.repository.getMovieReview(reviewId);
    if (!response) throw new MovieReviewNotFound();
    if (response.userId !== userId) throw new UnauthorizedException();

    await this.repository.updateReview(reviewId, notes);
  }
}
