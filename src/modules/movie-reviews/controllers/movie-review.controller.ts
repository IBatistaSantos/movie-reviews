import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';

import { CreateMovieReviewService } from '../services/create-movie-reviews.service';
import { JwtAuthGuard } from '@/modules/auth/guard/jwt-auth.guard';
import { GetUser } from '@/modules/shared/decorator/get-user.decorator';
import { CreateReviewDTO } from './dtos/create-review.dto';
import { DetailMovieReviewService } from '../services/details-movie-review.service';
import { DeleteMovieReviewsService } from '../services/delete-movie-reviews.service';
import { UpdateMovieReviewService } from '../services/update-movie-review.service';
import { UpdateMovieReviewDTO } from './dtos/update-review.dto';
import {
  ListMovieReviewsOutput,
  ListMovieReviewsService,
} from '../services/list-movie-reviews.service';

@UseGuards(JwtAuthGuard)
@ApiTags('movie-reviews')
@Controller('movie-reviews')
export class MovieReviewController {
  constructor(
    private readonly createMovieService: CreateMovieReviewService,
    private readonly detailMovieReviewService: DetailMovieReviewService,
    private readonly listMovieReviewService: ListMovieReviewsService,
    private readonly deleteMovieReviewService: DeleteMovieReviewsService,
    private readonly updateMovieReviewService: UpdateMovieReviewService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async createReview(
    @GetUser() user,
    @Body() createReviewDTO: CreateReviewDTO,
  ): Promise<any> {
    return this.createMovieService.execute({
      userId: user.id,
      title: createReviewDTO.title,
      notes: createReviewDTO.notes,
    });
  }

  @Get(':reviewId')
  async getReview(
    @Param('reviewId') reviewId: string,
    @GetUser() user,
  ): Promise<any> {
    return this.detailMovieReviewService.execute({
      reviewId,
      userId: user.id,
    });
  }

  @Delete(':reviewId')
  async deleteReview(
    @Param('reviewId') reviewId: string,
    @GetUser() user,
  ): Promise<void> {
    await this.deleteMovieReviewService.execute({
      reviewId,
      userId: user.id,
    });
  }

  @Put(':reviewId')
  async updateReview(
    @Param('reviewId') reviewId: string,
    @GetUser() user,
    @Body() data: UpdateMovieReviewDTO,
  ): Promise<void> {
    await this.updateMovieReviewService.execute({
      reviewId,
      userId: user.id,
      notes: data.notes,
    });
  }

  @Get()
  @ApiResponse({
    schema: {
      type: 'object',
      properties: {
        page: { type: 'number' },
        limit: { type: 'number' },
        hasMore: { type: 'boolean' },
        data: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              notes: { type: 'string' },
              userId: { type: 'string' },
              name: { type: 'string' },
              movie: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  title: { type: 'string' },
                  actor: { type: 'string' },
                  poster: { type: 'string' },
                  rating: { type: 'number' },
                  genre: { type: 'string' },
                },
              },
            },
          },
        },
      },
    },
  })
  @ApiQuery({ name: 'title', required: false })
  @ApiQuery({ name: 'actor', required: false })
  @ApiQuery({ name: 'director', required: false })
  @ApiQuery({ name: 'sortBy', required: false })
  @ApiQuery({ name: 'order', required: false, enum: ['ASC', 'DESC'] })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    schema: { default: 10 },
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    schema: { default: 1 },
  })
  async listMovieReviews(
    @GetUser() user: any,
    @Query('title') title?: string,
    @Query('actor') actor?: string,
    @Query('director') director?: string,
    @Query('sortBy') sortBy?: string,
    @Query('order') order?: 'ASC' | 'DESC',
    @Query('limit') limit?: number,
    @Query('page') page?: number,
  ): Promise<ListMovieReviewsOutput> {
    const userId = user.id;
    return this.listMovieReviewService.execute({
      userId,
      options: {
        limit,
        page,
        title,
        actor,
        director,
        sortBy,
        order,
      },
    });
  }
}
