import { BaseError } from './base-error';

export class BadException extends BaseError {
  constructor(message: string) {
    super(message);
    this.name = 'BadException';
    this.statusCode = 400;
  }
}
