import { BaseError } from './base-error';

export class TokenExpiredException extends BaseError {
  constructor(message: string) {
    super(message);
    this.name = 'TokenExpiredException';
  }
}
