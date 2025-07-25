import { randomUUID } from 'crypto';
import { RequestContext } from 'nestjs-request-context';

export interface BaseSerializedError {
  message: string;
  code: string;
  correlationId: string;
  stack?: string;
  cause?: string;
  metadata?: unknown;
}

export abstract class BaseError extends Error {
  public readonly correlationId: string;

  constructor(
    readonly message: string,
    readonly code: string,
    readonly cause?: Error,
    readonly metadata?: unknown,
  ) {
    super(message);
    Error.captureStackTrace(this, this.constructor);
    const ctxId = RequestContext.currentContext?.req.id ?? randomUUID();
    this.correlationId = ctxId;
  }

  toJSON(): BaseSerializedError {
    return {
      message: this.message,
      code: this.code,
      stack: this.stack,
      correlationId: this.correlationId,
      cause: JSON.stringify(this.cause),
      metadata: this.metadata,
    };
  }
}

export class RequestValidationError extends BaseError {
  static CODE = 'COMMON.REQUEST_VALIDATION_ERROR';

  constructor() {
    super('request input validation error', RequestValidationError.CODE);
  }
}

export class InternalServerError extends BaseError {
  static CODE = 'COMMON.INTERNAL_SERVER_ERROR';

  constructor() {
    super('Internal server error', InternalServerError.CODE);
  }
}

export class RecordNotFoundError extends BaseError {
  static CODE = 'COMMON.ENTITY_NOT_FOUND';

  constructor() {
    super('Entity not found', RecordNotFoundError.CODE);
  }
}

export class PermissionDeniedError extends BaseError {
  static CODE = 'COMMON.PERMISSION_DENIED';

  constructor(message?: string) {
    super(message ?? 'User permission Denied', PermissionDeniedError.CODE);
  }
}

export class UnauthorizedError extends BaseError {
  static CODE: string = 'COMMON.UNAUTHORIZED';

  constructor(message?: string) {
    super(message ?? 'Unauthorized can not access', UnauthorizedError.CODE);
  }
}
