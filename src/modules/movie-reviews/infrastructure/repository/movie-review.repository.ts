import { Repository } from 'typeorm';
import { Movie } from '../../entity/movie';
import {
  MovieRepository,
  MovieReviewData,
  MovieReviewOutput,
} from '../../repositories/movie.repository';
import { MovieSchema } from './schemas/movie.schema';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmMapper } from '@/modules/users/infrastructure/repository/typeorm.mapper';
import { MovieReviewSchema } from './schemas/movie-review.schema';

export class MovieReviewRepositoryImpl implements MovieRepository {
  constructor(
    @InjectRepository(MovieSchema)
    private readonly repository: Repository<MovieSchema>,

    @InjectRepository(MovieReviewSchema)
    private readonly reviewRepository: Repository<MovieReviewSchema>,
  ) {}

  async findById(id: string): Promise<Movie | null> {
    const response = await this.repository.findOne({
      where: { id, status: 'ACTIVE' },
    });

    return TypeOrmMapper.toEntity(response, Movie);
  }

  async getMovieReview(reviewId: string): Promise<MovieReviewData> {
    const review = await this.reviewRepository.findOne({
      where: {
        id: reviewId,
      },
    });

    if (!review) {
      return null;
    }

    return {
      notes: review.notes,
      userId: review.user.id,
      movieId: review.movie.id,
    };
  }

  async deleteReview(reviewId: string): Promise<void> {
    await this.reviewRepository.delete(reviewId);
  }

  async updateReview(reviewId: string, notes: string): Promise<void> {
    await this.reviewRepository.update(reviewId, {
      notes,
    });
  }

  async findByTitle(title: string): Promise<Movie | null> {
    const movie = await this.repository.findOneBy({
      title,
      status: 'ACTIVE',
    });

    return TypeOrmMapper.toEntity(movie, Movie);
  }

  async save(movie: Movie): Promise<void> {
    const movieSchema = TypeOrmMapper.toSchema(movie);
    await this.repository.save(movieSchema);
  }

  async createReview(review: MovieReviewData): Promise<MovieReviewOutput> {
    const response = await this.reviewRepository.save({
      movie: {
        id: review.movieId,
      },
      user: {
        id: review.userId,
      },
      notes: review.notes,
    });

    return {
      id: response.id,
      userId: response.user.id,
      movieId: response.movie.id,
      notes: response.notes,
    };
  }
}
