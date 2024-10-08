import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';

import { CreateMovieReviewService } from './services/create-movie-reviews.service';
import { SearchMovieOmdbProvider } from './providers/search-movie-omdb.provider';
import { MovieReviewController } from './controllers/movie-review.controller';
import { MovieReviewRepositoryImpl } from './infrastructure/repository/movie-review.repository';
import { MovieSchema } from './infrastructure/repository/schemas/movie.schema';
import { MovieReviewSchema } from './infrastructure/repository/schemas/movie-review.schema';
import { DetailMovieReviewService } from './services/details-movie-review.service';
import { DeleteMovieReviewsService } from './services/delete-movie-reviews.service';
import { UpdateMovieReviewService } from './services/update-movie-review.service';

@Module({
  imports: [
    HttpModule,
    TypeOrmModule.forFeature([MovieSchema, MovieReviewSchema]),
  ],
  controllers: [MovieReviewController],
  providers: [
    CreateMovieReviewService,
    DetailMovieReviewService,
    DeleteMovieReviewsService,
    UpdateMovieReviewService,
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
