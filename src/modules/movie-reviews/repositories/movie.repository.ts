import { Movie } from '../entity/movie';

export interface MovieReviewData {
  notes: string;
  userId: string;
  movieId: string;
}

export interface MovieRepository {
  getMovieReview(movieId: string): Promise<MovieReviewData>;
  deleteReview(reviewId: string): Promise<void>;
  findByTitle(title: string): Promise<Movie | null>;
  findById(id: string): Promise<Movie | null>;
  save(movie: Movie): Promise<void>;
  createReview(review: MovieReviewData): Promise<void>;
  updateReview(reviewId: string, notes: string): Promise<void>;
}
