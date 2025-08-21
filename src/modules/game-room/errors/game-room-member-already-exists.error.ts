import { BaseError } from '@common/base/base.error';

export class GameRoomMemberAlreadyExistsError extends BaseError {
  static CODE: string = 'GAME_ROOM_MEMBER.ALREADY_EXISTS';

  constructor(message?: string) {
    super(
      message ?? 'Game Room member already exists',
      GameRoomMemberAlreadyExistsError.CODE,
    );
  }
}
