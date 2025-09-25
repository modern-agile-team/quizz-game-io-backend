import { ExecutionContext } from '@nestjs/common';

import { AccountRole } from '@module/account/entities/account.entity';

import { BaseHttpException } from '@common/base/base-http-exception';
import {
  PermissionDeniedError,
  UnauthorizedError,
} from '@common/base/base.error';
import { AdminGuard } from '@common/guards/admin.guard';

describe(AdminGuard.name, () => {
  const guard = new AdminGuard();

  const createContext = (user: any): ExecutionContext => {
    return {
      switchToHttp: () => ({
        getRequest: () => ({ user }),
      }),
    } as unknown as ExecutionContext;
  };

  describe('관리자 권한 유저가 요청하면', () => {
    it('요청이 허용돼야 한다.', () => {
      const context = createContext({ role: AccountRole.admin });

      expect(guard.canActivate(context)).toBe(true);
    });
  });

  describe('사용자 정보가 없는 경우', () => {
    it('Unauthorized 예외를 발생시켜야 한다.', () => {
      const context = createContext(undefined);

      let thrownError: BaseHttpException | undefined;

      try {
        guard.canActivate(context);
      } catch (error) {
        thrownError = error as BaseHttpException;
      }

      expect(thrownError).toBeInstanceOf(BaseHttpException);
      expect(thrownError?.error).toBeInstanceOf(UnauthorizedError);
    });
  });

  describe('관리자 권한이 아닌 유저가 요청하면', () => {
    it('PermissionDenied 예외를 발생시켜야 한다.', () => {
      const context = createContext({ role: AccountRole.user });

      let thrownError: BaseHttpException | undefined;

      try {
        guard.canActivate(context);
      } catch (error) {
        thrownError = error as BaseHttpException;
      }

      expect(thrownError).toBeInstanceOf(BaseHttpException);
      expect(thrownError?.error).toBeInstanceOf(PermissionDeniedError);
    });
  });
});
