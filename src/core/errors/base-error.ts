export class BaseError extends Error {
  public statusCode: number = 400;
  constructor(message: string, statusCode: number = 400) {
    super(message);
    this.statusCode = statusCode;
    this.name = 'BaseError';
  }
}
