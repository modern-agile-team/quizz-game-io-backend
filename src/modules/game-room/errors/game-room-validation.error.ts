import { BaseError } from '@common/base/base.error';

export class GameRoomValidationError extends BaseError {
  static CODE: string = 'GAME_ROOM.VALIDATION_ERROR';

  constructor(message?: string) {
    super(message ?? 'GameRoom validation error', GameRoomValidationError.CODE);
  }
}
