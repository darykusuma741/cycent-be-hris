import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus, Inject, Logger } from '@nestjs/common';
import { ThrottlerException } from '@nestjs/throttler';
import { Response, Request } from 'express';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import * as fs from 'fs';

@Catch(ThrottlerException)
export class ThrottlerFilter implements ExceptionFilter<ThrottlerException> {
  constructor(@Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger) {}

  catch(exception: ThrottlerException, host: ArgumentsHost) {
    const http = host.switchToHttp();
    const response = http.getResponse<Response>();
    const request = http.getRequest<Request>();

    const filePath = request.file?.path;

    if (filePath) {
      try {
        fs.unlinkSync(filePath);
      } catch (err) {
        this.logger.warn('Failed to delete file', err);
      }
    }

    this.logger.error(`${exception.message}`);
    response.status(HttpStatus.TOO_MANY_REQUESTS).json({
      statusCode: HttpStatus.TOO_MANY_REQUESTS,
      // message: exception.errors.map((e) => `${e.path}, ${e.message}`).join(' || '),
      message: `To many request`,
    });
  }
}
