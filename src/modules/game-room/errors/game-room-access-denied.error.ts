import { BaseError } from '@common/base/base.error';

export class GameRoomAccessDeniedError extends BaseError {
  static CODE: string = 'GAME_ROOM.ACCESS_DENIED';

  constructor(message?: string) {
    super(message ?? 'Game room access denied', GameRoomAccessDeniedError.CODE);
  }
}
