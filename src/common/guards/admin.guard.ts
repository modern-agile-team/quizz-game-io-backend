import {
  CanActivate,
  ExecutionContext,
  HttpStatus,
  Injectable,
} from '@nestjs/common';

import { BaseHttpException } from '@common/base/base-http-exception';
import { PermissionDeniedError } from '@common/base/base.error';

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (user.role !== 'admin') {
      throw new BaseHttpException(
        HttpStatus.FORBIDDEN,
        new PermissionDeniedError(),
      );
    }

    return true;
  }
}
