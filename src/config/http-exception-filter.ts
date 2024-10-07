import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { Response } from 'express';
import { BaseError } from '../core/errors/base-error';

@Catch(BaseError)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: BaseError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.statusCode || 500;

    response.status(status).json({
      statusCode: status,
      message: exception.message,
    });
  }
}
