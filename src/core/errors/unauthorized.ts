import { BaseError } from './base-error';

export class UnauthorizedException extends BaseError {
  constructor() {
    super('Unauthorized');
    this.name = 'Unauthorized';
    this.statusCode = 401;
  }
}
