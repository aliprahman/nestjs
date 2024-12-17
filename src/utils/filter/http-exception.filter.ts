import { ExceptionFilter, Catch, ArgumentsHost, HttpException, InternalServerErrorException } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const detail: any =
      exception instanceof InternalServerErrorException
        ? exception
        : exception.getResponse();

    let message = undefined;
    if (detail.detail) {
      message = { message: detail.detail }
    } else if (detail.message) {
      message = detail.message 
    } else {
      message = detail
    }

    response
      .status(status)
      .json({
        status: false,
        statusCode: status,
        path: request.url,
        result: {
          error: exception.message,
          detail: message,
        },
      });
  }
}