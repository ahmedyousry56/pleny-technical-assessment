import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
  ValidationError,
} from '@nestjs/common';
import { I18nValidationException } from 'nestjs-i18n';
import { Response } from 'express';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    if (exception instanceof I18nValidationException) {
      return this.handleValidationException(exception, response);
    }

    if (exception instanceof HttpException) {
      return this.handleHttpException(exception, response);
    }

    return this.handleUnknownException(exception, response);
  }

  private handleValidationException(exception: I18nValidationException, response: Response) {
    const formattedErrors: Record<string, string> = {};

    const formatError = (error: ValidationError) => {
      const fieldName = error.property;

      if (error.constraints) {
        const firstConstraint = Object.values(error.constraints)[0];
        if (firstConstraint) {
          formattedErrors[fieldName] = firstConstraint as string;
        }
      }

      if (error.children?.length) {
        error.children.forEach((child: any) => formatError(child));
      }
    };

    exception.errors.forEach((err: any) => formatError(err));

    response.status(HttpStatus.UNPROCESSABLE_ENTITY).json(formattedErrors);
  }

  private handleHttpException(exception: HttpException, response: Response) {
    let status = exception.getStatus();
    const res = exception.getResponse() as any;
    let message = res?.message || res || exception.message;

    if (status === HttpStatus.BAD_REQUEST && Array.isArray(res?.message)) {
      status = HttpStatus.UNPROCESSABLE_ENTITY;
      message = res.message;
    }

    this.sendStandardResponse(response, status, message);
  }

  private handleUnknownException(exception: unknown, response: Response) {
    let message = 'Internal server error';

    if (exception instanceof Error) {
      this.logger.error(exception.message, exception.stack);
      message = exception.message;
    }

    this.sendStandardResponse(response, HttpStatus.INTERNAL_SERVER_ERROR, message);
  }

  private sendStandardResponse(response: Response, status: number, message: any) {
    response.status(status).json({
      statusCode: status,
      message,
      timestamp: new Date().toISOString(),
    });
  }
}
