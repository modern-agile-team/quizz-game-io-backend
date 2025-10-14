import { BaseError } from '@common/base/base.error';

export class NicknameSourceNotFoundError extends BaseError {
  static CODE = 'NICKNAME_SOURCE.NOT_FOUND';

  constructor(message?: string) {
    super(
      message ?? 'Nickname source not found',
      NicknameSourceNotFoundError.CODE,
    );
  }
}
