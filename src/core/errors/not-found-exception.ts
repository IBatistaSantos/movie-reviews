import { BaseError } from './base-error';

export class NotFoundException extends BaseError {
  constructor(message: string) {
    super(message);
    this.name = 'NotFoundException';
    this.statusCode = 404;
  }
}
