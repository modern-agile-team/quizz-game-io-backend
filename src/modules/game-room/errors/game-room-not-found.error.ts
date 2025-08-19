import { BaseError } from '@common/base/base.error';

export class GameRoomNotFoundError extends BaseError {
  static CODE: string = 'GAME_ROOM.NOT_FOUND';

  constructor(message?: string) {
    super(message ?? 'GameRoom not found', GameRoomNotFoundError.CODE);
  }
}
