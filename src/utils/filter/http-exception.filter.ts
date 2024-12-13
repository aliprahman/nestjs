import { ExceptionFilter, Catch, ArgumentsHost, HttpException, InternalServerErrorException } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const detail =
      exception instanceof InternalServerErrorException
        ? exception
        : exception.getResponse();

    response
      .status(status)
      .json({
        status: false,
        statusCode: status,
        path: request.url,
        result: {
          error: exception.message,
        },
      });
  }
}