import { Repository } from 'typeorm';
import { Movie } from '../../entity/movie';
import {
  ListMovieReviewsOutput,
  MovieRepository,
  MovieReviewData,
  MovieReviewOutput,
} from '../../repositories/movie.repository';
import { MovieSchema } from './schemas/movie.schema';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmMapper } from '@/modules/users/infrastructure/repository/typeorm.mapper';
import { MovieReviewSchema } from './schemas/movie-review.schema';
import { ListMovieReviewsOptions } from '../../services/list-movie-reviews.service';

export class MovieReviewRepositoryImpl implements MovieRepository {
  constructor(
    @InjectRepository(MovieSchema)
    private readonly repository: Repository<MovieSchema>,

    @InjectRepository(MovieReviewSchema)
    private readonly reviewRepository: Repository<MovieReviewSchema>,
  ) {}

  async listMovieReviews(
    userId: string,
    options: Partial<ListMovieReviewsOptions>,
  ): Promise<ListMovieReviewsOutput> {
    const { page, limit, title, actor, director, notes, sortBy, order } =
      options;

    const query = this.reviewRepository
      .createQueryBuilder('review')
      .leftJoinAndSelect('review.movie', 'movie')
      .leftJoinAndSelect('review.user', 'user')
      .where('user.id = :userId', { userId });

    if (title) {
      query.andWhere('LOWER(movie.title) LIKE :title', {
        title: `%${title.toLowerCase()}%`,
      });
    }

    if (actor) {
      query.andWhere('LOWER(movie.actor) LIKE :actor', {
        actor: `%${actor.toLowerCase()}%`,
      });
    }

    if (director) {
      query.andWhere('LOWER(movie.director) LIKE :director', {
        director: `%${director.toLowerCase()}%`,
      });
    }

    if (notes) {
      query.andWhere('LOWER(review.notes) LIKE :notes', {
        notes: `%${notes.toLowerCase()}%`,
      });
    }

    if (sortBy) {
      query.orderBy(`movie.${sortBy}`, order);
    }

    if (page && limit) {
      query.skip((page - 1) * limit).take(limit);
    }

    const [review, total] = await query.getManyAndCount();

    const reviewMapper = review.map((review) => ({
      notes: review.notes,
      userId: review.user.id,
      name: review.user.name,
      movie: {
        id: review.movie.id,
        title: review.movie.title,
        actor: review.movie.actors,
        poster: review.movie.poster,
        rating: review.movie.rating,
        genre: review.movie.genre,
      },
    }));

    return { data: reviewMapper, total };
  }

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
