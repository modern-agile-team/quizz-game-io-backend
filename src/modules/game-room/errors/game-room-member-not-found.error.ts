import { BaseError } from '@common/base/base.error';

export class GameRoomMemberNotFoundError extends BaseError {
  static CODE: string = 'GAME_ROOM_MEMBER.NOT_FOUND';

  constructor(message?: string) {
    super(
      message ?? 'Game Room member not found',
      GameRoomMemberNotFoundError.CODE,
    );
  }
}
