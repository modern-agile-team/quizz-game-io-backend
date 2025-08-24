import { ApiProperty } from '@nestjs/swagger';

import { GameRoomMemberRole } from '@module/game-room/entities/game-room-member.entity';

import { BaseSocketEvent } from '@common/base/base-socket-event';

class GameRoomMemberJoinedSocketEventBody {
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

export class GameRoomMemberJoinedSocketEvent extends BaseSocketEvent<GameRoomMemberJoinedSocketEventBody> {
  static readonly EVENT_NAME = 'game_room.member_joined';

  @ApiProperty({ example: GameRoomMemberJoinedSocketEvent.EVENT_NAME })
  readonly eventName: string = GameRoomMemberJoinedSocketEvent.EVENT_NAME;

  @ApiProperty({ type: GameRoomMemberJoinedSocketEventBody })
  body: GameRoomMemberJoinedSocketEventBody;
}
