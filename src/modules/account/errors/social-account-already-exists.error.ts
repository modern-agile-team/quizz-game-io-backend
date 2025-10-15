import { BaseError } from '@common/base/base.error';

export class SocialAccountAlreadyExistsError extends BaseError {
  static CODE = 'ACCOUNT.SOCIAL_ACCOUNT_ALREADY_EXISTS';
  constructor(message?: string) {
    super(
      message ?? 'Social account already exists',
      SocialAccountAlreadyExistsError.CODE,
    );
  }
}
