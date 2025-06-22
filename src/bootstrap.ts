import {
  BadRequestException,
  ClassSerializerInterceptor,
  INestApplication,
  ValidationError,
  ValidationPipe,
  ValidationPipeOptions,
} from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';

import { AppModule } from 'src/app.module';

import { BaseHttpExceptionFilter } from '@common/base/base-http-exception.filter';
import { RequestValidationError } from '@common/base/base.error';

import { LOGGER } from '@shared/logger/logger.module';

export const createApp = async () => {
  return await NestFactory.create(AppModule, { bufferLogs: true });
};

export const setGlobalPipe = (app: INestApplication) => {
  const options: Omit<ValidationPipeOptions, 'exceptionFactory'> = {
    transform: true,
    whitelist: true,
  };

  const exceptionFactory = (validationErrors: ValidationError[]) => {
    function flattenValidationErrors(
      errors: ValidationError[],
      parentPath: string = '',
    ): any[] {
      return errors.flatMap(({ property, constraints, children }) => {
        const path = parentPath ? `${parentPath}.${property}` : property;
        const result: any[] = [];

        if (constraints) {
          result.push({
            property: path,
            constraints: Object.values(constraints).map((message) =>
              message.replace(property, path),
            ),
          });
        }

        if (children?.length) {
          result.push(...flattenValidationErrors(children, path));
        }

        return result;
      });
    }

    throw new BadRequestException({
      statusCode: 400,
      message: 'request input validation error',
      code: RequestValidationError.CODE,
      errors: flattenValidationErrors(validationErrors),
    });
  };

  app.useGlobalPipes(new ValidationPipe({ ...options, exceptionFactory }));
};

export const setLogger = (app: INestApplication) => {
  app.useLogger(app.get(LOGGER));
};

export const setGlobalInterceptor = (app: INestApplication) => {
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
};

export const setGlobalExceptionFilter = (app: INestApplication) => {
  app.useGlobalFilters(new BaseHttpExceptionFilter());
};
