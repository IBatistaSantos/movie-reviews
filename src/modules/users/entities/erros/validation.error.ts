import { BaseError } from '../../../../core/errors/base-error';

export class ValidationEmailError extends BaseError {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationEmailError';
  }
}
