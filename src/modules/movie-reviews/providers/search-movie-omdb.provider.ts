import { catchError, firstValueFrom } from 'rxjs';
import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';

import { MovieProvider, SearchMovieProvider } from './search-movie';

interface MovieOMDB {
  Title: string;
  Year: string;
  Actors: string;
  Poster: string;
  Released: string;
  Genre: string;
  imdbRating: string;
}

@Injectable()
export class SearchMovieOmdbProvider implements SearchMovieProvider {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  async search(title: string): Promise<MovieProvider | null> {
    const url = `http://www.omdbapi.com/?apikey=${this.configService.get('OMDB_API_KEY')}&t=${title}`;
    const { data } = await firstValueFrom<{ data: MovieOMDB }>(
      this.httpService.get(url).pipe(
        catchError(() => {
          return [null];
        }),
      ),
    );

    return {
      title: data.Title,
      year: data.Year,
      actors: data.Actors,
      poster: data.Poster,
      released: data.Released,
      genre: data.Genre,
      rating: parseFloat(data.imdbRating),
    };
  }
}
