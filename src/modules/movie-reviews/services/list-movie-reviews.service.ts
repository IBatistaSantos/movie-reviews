import { Inject, Injectable } from '@nestjs/common';
import { MovieRepository } from '../repositories/movie.repository';

export interface ListMovieReviewsOptions {
  page: number;
  limit: number;
  notes: string;
  title: string;
  actor: string;
  director: string;
  sortBy: string;
  order: 'ASC' | 'DESC';
}

interface Input {
  userId: string;
  options?: Partial<ListMovieReviewsOptions>;
}

interface ListMovieReviewData {
  notes: string;
  userId: string;
  name: string;
  movie: {
    id: string;
    title: string;
    actor: string;
    poster: string;
    rating: number;
    genre: string;
  };
}

export interface ListMovieReviewsOutput {
  page: number;
  limit: number;
  hasMore: boolean;
  data: ListMovieReviewData[];
}

@Injectable()
export class ListMovieReviewsService {
  constructor(
    @Inject('MovieRepository')
    private movieReviewsRepository: MovieRepository,
  ) {}

  async execute(params: Input): Promise<ListMovieReviewsOutput> {
    const { userId, options } = params;
    const { title, actor, director, notes } = options;

    const page = params.options?.page || 1;
    const limit = params.options?.limit || 10;
    const sortBy = params.options?.sortBy || 'rating';
    const order = params.options?.order || 'ASC';

    const { data, total } = await this.movieReviewsRepository.listMovieReviews(
      userId,
      {
        page,
        limit,
        title,
        actor,
        notes,
        director,
        sortBy,
        order,
      },
    );

    const hasMorePage = total > limit * page;

    return {
      page,
      limit: Number(limit),
      hasMore: hasMorePage,
      data,
    };
  }
}
