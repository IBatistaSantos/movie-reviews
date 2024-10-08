import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';

import { CreateMovieReviewService } from './services/create-movie-reviews.service';
import { SearchMovieOmdbProvider } from './providers/search-movie-omdb.provider';
import { MovieReviewController } from './controllers/movie-review.controller';
import { MovieReviewRepositoryImpl } from './infrastructure/repository/movie-review.repository';
import { MovieSchema } from './infrastructure/repository/schemas/movie.schema';
import { MovieReviewSchema } from './infrastructure/repository/schemas/movie-review.schema';

@Module({
  imports: [
    HttpModule,
    TypeOrmModule.forFeature([MovieSchema, MovieReviewSchema]),
  ],
  controllers: [MovieReviewController],
  providers: [
    CreateMovieReviewService,
    {
      provide: 'SearchMovieProvider',
      useClass: SearchMovieOmdbProvider,
    },
    {
      provide: 'MovieRepository',
      useClass: MovieReviewRepositoryImpl,
    },
  ],
  exports: [],
})
export class MovieReviewModule {}
