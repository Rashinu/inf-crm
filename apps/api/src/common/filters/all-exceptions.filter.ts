import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();

    const httpStatus =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const responseBody = {
      statusCode: httpStatus,
      timestamp: new Date().toISOString(),
      path: httpAdapter.getRequestUrl(ctx.getRequest()),
      message: (exception as any).message || 'Internal server error',
    };

    // Log detailed error to console (visible in Render logs)
    console.error('--- EXCEPTION LOG ---');
    console.error(`Path: ${responseBody.path}`);
    console.error(`Status: ${httpStatus}`);
    console.error(`Exception:`, exception);
    console.error('----------------------');

    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
  }
}
