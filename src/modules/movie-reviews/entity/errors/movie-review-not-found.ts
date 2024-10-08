import { BaseError } from '@/core/errors/base-error';

export class MovieReviewNotFound extends BaseError {
  constructor() {
    super('Movie review not found');
    this.name = 'MovieReviewNotFound';
    this.statusCode = 404;
  }
}
