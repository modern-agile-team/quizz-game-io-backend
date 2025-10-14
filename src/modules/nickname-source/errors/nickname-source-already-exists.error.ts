import { BaseError } from '@common/base/base.error';

export class NicknameSourceAlreadyExistsError extends BaseError {
  static CODE = 'NICKNAME_SOURCE.ALREADY_EXISTS';

  constructor(message?: string) {
    super(
      message ?? 'Nickname source already exists',
      NicknameSourceAlreadyExistsError.CODE,
    );
  }
}
