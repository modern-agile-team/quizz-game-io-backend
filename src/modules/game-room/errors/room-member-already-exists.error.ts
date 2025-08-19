import { BaseError } from '@common/base/base.error';

export class RoomMemberAlreadyExistsError extends BaseError {
  static CODE: string = 'ROOM_MEMBER.ALREADY_EXISTS';

  constructor(message?: string) {
    super(
      message ?? 'Room member already exists',
      RoomMemberAlreadyExistsError.CODE,
    );
  }
}
