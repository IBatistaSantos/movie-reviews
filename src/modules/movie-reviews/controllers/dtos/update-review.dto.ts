import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateMovieReviewDTO {
  @IsString()
  @IsNotEmpty()
  notes: string;
}
