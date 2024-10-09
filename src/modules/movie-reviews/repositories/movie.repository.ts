import { Movie } from '../entity/movie';
import { ListMovieReviewsOptions } from '../services/list-movie-reviews.service';

export interface MovieReviewData {
  notes: string;
  userId: string;
  movieId: string;
}

export interface MovieReviewOutput extends MovieReviewData {
  id: string;
}

export interface ListMovieReviewsOutput {
  total: number;
  data: any[];
}

export interface MovieRepository {
  getMovieReview(movieId: string): Promise<MovieReviewData>;
  deleteReview(reviewId: string): Promise<void>;
  findByTitle(title: string): Promise<Movie | null>;
  findById(id: string): Promise<Movie | null>;
  listMovieReviews(
    userId: string,
    options: Partial<ListMovieReviewsOptions>,
  ): Promise<ListMovieReviewsOutput>;
  save(movie: Movie): Promise<void>;
  createReview(review: MovieReviewData): Promise<MovieReviewOutput>;
  updateReview(reviewId: string, notes: string): Promise<void>;
}
