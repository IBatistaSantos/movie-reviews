import { Movie } from '../entity/movie';

export interface MovieReviewData {
  notes: string;
  userId: string;
  movieId: string;
}

export interface MovieRepository {
  findByTitle(title: string): Promise<Movie | null>;
  save(movie: Movie): Promise<void>;
  createReview(review: MovieReviewData): Promise<void>;
}
