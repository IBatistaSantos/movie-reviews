import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { CreateMovieReviewService } from '../services/create-movie-reviews.service';
import { JwtAuthGuard } from '@/modules/auth/guard/jwt-auth.guard';
import { GetUser } from '@/modules/shared/decorator/get-user.decorator';
import { CreateReviewDTO } from './dtos/create-review.dto';
import { DetailMovieReviewService } from '../services/details-movie-review.service';
import { DeleteMovieReviewsService } from '../services/delete-movie-reviews.service';
import { UpdateMovieReviewService } from '../services/update-movie-review.service';
import { UpdateMovieReviewDTO } from './dtos/update-review.dto';

@UseGuards(JwtAuthGuard)
@ApiTags('movie-reviews')
@Controller('movie-reviews')
export class MovieReviewController {
  constructor(
    private readonly createMovieService: CreateMovieReviewService,
    private readonly detailMovieReviewService: DetailMovieReviewService,
    private readonly deleteMovieReviewService: DeleteMovieReviewsService,
    private readonly updateMovieReviewService: UpdateMovieReviewService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async createReview(
    @GetUser() user,
    @Body() createReviewDTO: CreateReviewDTO,
  ): Promise<any> {
    await this.createMovieService.execute({
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
}
