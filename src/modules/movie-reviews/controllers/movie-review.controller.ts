import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { CreateMovieReviewService } from '../services/create-movie-reviews.service';
import { JwtAuthGuard } from '@/modules/auth/guard/jwt-auth.guard';
import { GetUser } from '@/modules/shared/decorator/get-user.decorator';
import { CreateReviewDTO } from './dtos/create-review.dto';

@UseGuards(JwtAuthGuard)
@ApiTags('movie-reviews')
@Controller('movie-reviews')
export class MovieReviewController {
  constructor(private readonly createMovieService: CreateMovieReviewService) {}

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
}
