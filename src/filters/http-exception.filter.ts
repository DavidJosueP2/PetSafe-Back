import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { QueryFailedError } from 'typeorm';

interface StandardErrorResponse {
  statusCode: number;
  message: string | string[];
  error: string;
  timestamp: string;
  path: string;
}

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status: number;
    let message: string | string[];
    let error: string;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
        error = exception.name;
      } else if (typeof exceptionResponse === 'object') {
        const res = exceptionResponse as Record<string, unknown>;
        message = (res.message as string | string[]) || exception.message;
        error = (res.error as string) || exception.name;
      } else {
        message = exception.message;
        error = exception.name;
      }
    } else if (exception instanceof QueryFailedError) {
      // Handle DB errors (unique constraint, FK violations, etc.)
      const pgError = exception as QueryFailedError & { code?: string; detail?: string };

      if (pgError.code === '23505') {
        // unique_violation
        status = HttpStatus.CONFLICT;
        message = 'El recurso ya existe o viola una restricción de unicidad';
        error = 'Conflict';
      } else if (pgError.code === '23503') {
        // foreign_key_violation
        status = HttpStatus.BAD_REQUEST;
        message = 'Referencia a un recurso inexistente';
        error = 'Bad Request';
      } else if (pgError.code === '23502') {
        // not_null_violation
        status = HttpStatus.BAD_REQUEST;
        message = 'Faltan campos obligatorios';
        error = 'Bad Request';
      } else {
        status = HttpStatus.INTERNAL_SERVER_ERROR;
        message = 'Error interno de base de datos';
        error = 'Internal Server Error';
      }

      this.logger.error(
        `DB Error [${pgError.code}]: ${pgError.message}`,
        (exception as Error).stack,
      );
    } else {
      // Unknown errors
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      message = 'Error interno del servidor';
      error = 'Internal Server Error';

      this.logger.error(
        'Unhandled exception',
        exception instanceof Error ? exception.stack : String(exception),
      );
    }

    const body: StandardErrorResponse = {
      statusCode: status,
      message,
      error,
      timestamp: new Date().toISOString(),
      path: request.url,
    };

    response.status(status).json(body);
  }
}
