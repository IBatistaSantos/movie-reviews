import { Inject, Injectable } from '@nestjs/common';
import { MovieRepository } from '../repositories/movie.repository';
import { MovieProvider, SearchMovieProvider } from '../providers/search-movie';
import { Movie } from '../entity/movie';
import { MovieNotFound } from '../entity/errors/movie-not-found';

interface Input {
  userId: string;
  title: string;
  notes: string;
}

@Injectable()
export class CreateMovieReviewService {
  constructor(
    @Inject('MovieRepository')
    private readonly repository: MovieRepository,

    @Inject('SearchMovieProvider')
    private readonly searchMovieProvider: SearchMovieProvider,
  ) {}

  async execute(params: Input) {
    const { userId, title, notes } = params;

    const movieInformation = await this.searchMovieProvider.search(title);

    if (!movieInformation) {
      throw new MovieNotFound();
    }

    let movie = await this.repository.findByTitle(movieInformation.title);
    if (!movie) {
      movie = await this.createMovie(movieInformation);
    }

    const review = await this.repository.createReview({
      movieId: movie.id,
      userId,
      notes,
    });

    return {
      movie: {
        title: movie.title,
        poster: movie.poster,
      },
      reviewId: review.id,
    };
  }

  private async createMovie(movie: MovieProvider) {
    const newMovie = new Movie({
      title: movie.title,
      actors: movie.actors,
      genre: movie.genre,
      director: movie.director,
      poster: movie.poster,
      rating: movie.rating,
      released: movie.released,
      year: movie.year,
    });

    await this.repository.save(newMovie);

    return newMovie;
  }
}
