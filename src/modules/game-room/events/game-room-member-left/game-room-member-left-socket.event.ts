import { ApiProperty } from '@nestjs/swagger';

import { GameRoomMemberRole } from '@module/game-room/entities/game-room-member.entity';

import { BaseSocketEvent } from '@common/base/base-socket-event';

class GameRoomMemberLeftSocketEventBody {
  @ApiProperty()
  accountId: string;

  @ApiProperty()
  gameRoomId: string;

  @ApiProperty({
    title: 'GameRoomMemberRole',
    enum: GameRoomMemberRole,
    enumName: 'GameRoomMemberRole',
  })
  role: GameRoomMemberRole;

  @ApiProperty()
  nickname: string;

  @ApiProperty()
  currentMembersCount: number;
}

export class GameRoomMemberLeftSocketEvent extends BaseSocketEvent<GameRoomMemberLeftSocketEventBody> {
  static readonly EVENT_NAME = 'game_room.member_left';

  @ApiProperty({ example: GameRoomMemberLeftSocketEvent.EVENT_NAME })
  readonly eventName: string = GameRoomMemberLeftSocketEvent.EVENT_NAME;

  @ApiProperty({ type: GameRoomMemberLeftSocketEventBody })
  body: GameRoomMemberLeftSocketEventBody;
}
