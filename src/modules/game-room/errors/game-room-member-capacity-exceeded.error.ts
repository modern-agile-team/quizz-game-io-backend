import { BaseError } from '@common/base/base.error';

export class GameRoomMemberCapacityExceededError extends BaseError {
  static CODE: string = 'GAME_ROOM_MEMBER.CAPACITY_EXCEEDED';

  constructor(message?: string) {
    super(
      message ?? 'Game room member capacity exceeded',
      GameRoomMemberCapacityExceededError.CODE,
    );
  }
}
