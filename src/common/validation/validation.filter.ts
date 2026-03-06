import { ArgumentsHost, Catch, ExceptionFilter, Inject, LoggerService } from '@nestjs/common';
import { Response, Request } from 'express';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { ZodError } from 'zod';
import * as fs from 'fs';

@Catch(ZodError)
export class ValidationFilter implements ExceptionFilter<ZodError> {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER)
    private readonly logger: LoggerService,
  ) {}

  catch(exception: ZodError, host: ArgumentsHost) {
    const http = host.switchToHttp();
    const response = http.getResponse<Response>();
    const request = http.getRequest<Request>();

    // delete uploaded file jika ada
    try {
      if (request.file?.path && fs.existsSync(request.file.path)) {
        fs.unlinkSync(request.file.path);
      }
    } catch (err) {
      // ignore
    }

    // ambil issue pertama
    const firstIssue = exception.issues[0];
    const path = firstIssue?.path.join('.') ?? 'unknown';
    const message = firstIssue?.message ?? 'Validation error';

    // log ke winston
    this.logger.error(`${path}, ${message}`);

    // response ke client
    response.status(400).json({
      statusCode: 400,
      message: `${path}, ${message}`,
    });
  }
}
