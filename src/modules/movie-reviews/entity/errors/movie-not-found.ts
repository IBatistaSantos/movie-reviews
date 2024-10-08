import { BaseError } from '@/core/errors/base-error';

export class MovieNotFound extends BaseError {
  constructor() {
    super('Movie not found');
    this.name = 'MovieNotFound';
  }
}
