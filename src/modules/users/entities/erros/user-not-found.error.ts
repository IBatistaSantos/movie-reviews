import { BaseError } from '../../../../core/errors/base-error';

export class UserNotFoundError extends BaseError {
  constructor() {
    super('User not found');
    this.name = 'UserNotFoundError';
  }
}
